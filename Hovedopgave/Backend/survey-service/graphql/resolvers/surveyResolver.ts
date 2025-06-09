import {
    createResponseFactory,
    errorHandler,
    errorHandling,
    PrivilegeManager,
    UserContext,
} from '@kintella/shared';
import SurveySection from '../../database/models/surveySection';
import SurveyQuestion from '../../database/models/surveyQuestion';
import SurveyQuestionOption from '../../database/models/surveyQuestionOption';
import { EntityType, Resolvers, SurveyActions, SurveyRoles } from '../../generatedTypes';
import { surveyLoaders } from '../context';
import { SurveyController } from '../../database/controllers/surveyController';
import SurveyAccess from '../../database/models/surveyAccess';
import Survey from '../../database/models/survey';
import { PC } from '../../database/controllers/privilegeController';

const typeDefinition = 'Survey';
type SurveyContext = UserContext<surveyLoaders>;
const model = Survey;
const ResponseFactory = createResponseFactory(typeDefinition);

export const surveyResolver: Resolvers<SurveyContext> = {
    Query: {
        getSurveyById: errorHandler(async (_, { id }, ctx) => {
            return (await ctx.loaders.surveyLoader.load(id)) as Survey;
        }),
        getAllSurveys: errorHandler(async (_, { input }, ctx) => {
            const allIds = await SurveyController.getAllSurveysFromContext(ctx, { userIds: [ctx.user.userId] });
            return await model.findAll({ where: { id: allIds, } }) as Survey[];
        }),
    },
    Mutation: {
        createSurvey: errorHandler(async (_, { input }, ctx) => {
            const survey = {
                creatorId: ctx.user.userId,
                title: input.title,
                description: input.description,
                status: input.status,
                timeEstimate: input.timeEstimate,
                anonymous: input.anonymous,
            }
            const item = await model.create(survey);
            if (item) {
                await SurveyAccess.create({
                    surveyId: item.id,
                    entityId: ctx.user.userId,
                    accessGrantorId: ctx.user.userId,
                    entityType: EntityType.User,
                    role: SurveyRoles.Creator,
                });
                if (input.surveyAccess && input.surveyAccess.length > 0) {
                    for (const access of input.surveyAccess) {
                        await SurveyAccess.create({
                            surveyId: item.id,
                            entityId: access?.entityId as number,
                            accessGrantorId: ctx.user.userId,
                            entityType: access?.entityType as EntityType,
                            role: access?.role as SurveyRoles,
                        });
                    }
                }

                if (input.sections) {
                    for (const section of input.sections) {
                        const position = await SurveySection.count({
                            where: {
                                surveyId: item.id,
                            },
                        }) + 1;
                        const sectionItem = await SurveySection.create({ ...section, surveyId: item.id, position: position });
                        if (section && section.questions) {
                            for (const question of section.questions) {

                                const questionPosition = await SurveyQuestion.count({
                                    where: {
                                        sectionId: sectionItem.id,
                                    },
                                }) + 1;
                                const questionItem = await SurveyQuestion.create({ ...question, sectionId: sectionItem.id, position: questionPosition });
                                if (question && question.questionOptions) {
                                    for (const option of question.questionOptions) {
                                        const optionPosition = await SurveyQuestionOption.count({
                                            where: {
                                                questionId: questionItem.id,
                                            },
                                        }) + 1;
                                        await SurveyQuestionOption.create({ ...option, questionId: questionItem.id, position: optionPosition });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return ResponseFactory.successResponse('create', 1, [item.id.toString()]);
        }),
        updateSurveyById: errorHandler(async (_, { id, input }, ctx) => {
            const [affectedCount] = await model.update({
                id,
                title: input.title,
                description: input.description,
                status: input.status,
                timeEstimate: input.timeEstimate,
                anonymous: input.anonymous,
            }, { where: { id } });

            const currentSections = await ctx.loaders.surveySectionBySurveyIdLoader.load(id) as SurveySection[];
            const sectionIdsToDelete = currentSections.filter((section: SurveySection) => {
                return !input.sections?.some((inputSection) => inputSection?.id === section.id);
            }).map((section) => section.id);
            await SurveySection.destroy({ where: { id: sectionIdsToDelete }, cascade: true });

            for (const section of input.sections ?? []) {
                const sectionItem = {
                    title: section?.title,
                    description: section?.description,
                    position: (input.sections ?? []).indexOf(section) + 1,
                }
                const foundSection = await ctx.loaders.surveySectionLoader.load(section?.id as number);
                if (!foundSection) {
                    const newSection = await SurveySection.create({ ...sectionItem, surveyId: id });
                    if (section && section.questions) {
                        for (const question of section.questions) {
                            const questionItem = await SurveyQuestion.create({
                                sectionId: newSection.id,
                                question: question?.question,
                                description: question?.description,
                                type: question?.type,
                                required: question?.required,
                                position: section.questions.indexOf(question) + 1,
                            });
                            if (question && question.questionOptions && question.questionOptions?.length > 0) {
                                for (const option of question.questionOptions) {
                                    await SurveyQuestionOption.create({
                                        questionId: questionItem.id,
                                        text: option?.text,
                                        position: question.questionOptions.indexOf(option) + 1
                                    });
                                }
                            }
                        }
                    }
                } else {
                    await SurveySection.update({ ...sectionItem, sectionId: section?.id }, {
                        where: {
                            id: section?.id,
                        },
                    });
                    const currentSectionQuestions = (await ctx.loaders.surveyQuestionBySectionIdLoader.load(section?.id as number)) as SurveyQuestion[];
                    const questionIdsToDelete = currentSectionQuestions.filter((question: SurveyQuestion) => {
                        return !section?.questions?.some((inputQuestion) => inputQuestion?.id === question.id);
                    }).map((question: SurveyQuestion) => question.id);
                    await SurveyQuestion.destroy({
                        where: {
                            id: questionIdsToDelete,
                        },
                        cascade: true,
                    });
                    if (section && section.questions) {
                        for (const question of section.questions) {
                            const existingQuestion = await ctx.loaders.surveyQuestionLoader.load(question?.id as number);
                            const questionItem = {
                                question: question?.question,
                                description: question?.description,
                                type: question?.type,
                                required: question?.required,
                                position: section.questions.indexOf(question) + 1,
                                sectionId: section.id
                            }
                            if (!existingQuestion) {
                                const item = await SurveyQuestion.create({ ...questionItem });
                                if (question && question.questionOptions && question.questionOptions?.length > 0) {
                                    for (const option of question.questionOptions) {
                                        await SurveyQuestionOption.create({
                                            questionId: item.id,
                                            text: option?.text,
                                            position: question.questionOptions.indexOf(option) + 1,
                                        });
                                    }
                                }
                            } else {
                                await SurveyQuestion.update({ ...questionItem }, {
                                    where: { id: question?.id }
                                });
                                const currentQuestionOptions = (await ctx.loaders.surveyQuestionOptionByQuestionIdLoader.load(question?.id as number));
                                const questionOptionIdsToDelete = currentQuestionOptions?.filter((option) => {
                                    return !question?.questionOptions?.some((inputOption) => inputOption?.id === option.id);
                                }).map((option: SurveyQuestionOption) => option.id);
                                await SurveyQuestionOption.destroy({ where: { id: questionOptionIdsToDelete } });

                                if (question && question.questionOptions && question.questionOptions?.length > 0) {
                                    for (const option of question.questionOptions) {
                                        const existingOption = await ctx.loaders.surveyQuestionOptionLoader.load(option?.id as number);
                                        const optionItem = {
                                            questionId: question.id,
                                            text: option?.text,
                                            position: question.questionOptions.indexOf(option) + 1,
                                        }
                                        if (!existingOption) {
                                            await SurveyQuestionOption.create({ ...optionItem });
                                        } else {
                                            await SurveyQuestionOption.update({ ...optionItem, }, {
                                                where: {
                                                    id: option?.id,
                                                },
                                            });
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
            return ResponseFactory.successResponse('update', affectedCount, [id.toString()]);
        }),
        deleteSurveyById: errorHandling(async ({ id }) => {
            const deletedCount = await model.destroy({ where: { id } });
            return deletedCount > 0;
        }),
    },
    Survey: {
        sections: async (parent, _args, ctx) => {
            const result = await ctx.loaders.surveySectionBySurveyIdLoader.load(parent.id);
            if (!result) return [] as SurveySection[];
            return result;
        },
        surveyAccess: async (parent, _args, ctx) => {
            const result = await ctx.loaders.surveyAccessBySurveyIdLoader.load(parent.id);
            if (!result) return [] as SurveyAccess[];
            return result;
        },
        accessType: async (parent, _args, ctx) => {
            const result = await ctx.loaders.surveyAccessByEntityIdAndSurveyIdLoader.load({ entityId: ctx.user.userId, itemId: parent.id });
            return result?.role as SurveyRoles;
        },
        accessActions: async (parent, _args, ctx) => {
            const access = await ctx.loaders.surveyAccessByEntityIdAndSurveyIdLoader.load({ entityId: ctx.user.userId, itemId: parent.id });
            const actions = await ctx.loaders.getActionsForRole.load({
                role: access?.role as SurveyRoles,
                surveyId: parent.id
            });
            return actions as SurveyActions[];
        }
    },
    SurveySection: {
        survey: async (parent, _args, ctx) => {
            const result = await ctx.loaders.surveyLoader.load(parent.surveyId);
            if (!result) return {} as Survey;
            return result;
        },
        questions: async (parent, _args, ctx) => {
            const result = await ctx.loaders.surveyQuestionBySectionIdLoader.load(parent.id);
            if (!result) return [] as SurveyQuestion[];
            return result;
        },
    },
    SurveyQuestion: {
        section: async (parent, _args, ctx) => {
            const result = await ctx.loaders.surveySectionLoader.load(parent.sectionId);
            if (!result) return {} as SurveySection;
            return result;
        },
        questionOptions: async (parent, _args, ctx) => {
            const result = await ctx.loaders.surveyQuestionOptionByQuestionIdLoader.load(parent.id);
            if (!result) return [] as SurveyQuestionOption[];
            return result;
        },
    },
};

export default surveyResolver;
 