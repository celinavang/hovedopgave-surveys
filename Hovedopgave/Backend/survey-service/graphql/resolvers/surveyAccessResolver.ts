import { createResponseFactory, errorHandler, UserContext } from '@kintella/shared';
import Survey from "../../database/models/survey";
import SurveyInstance from "../../database/models/surveyInstance";
import SurveyAccess from "../../database/models/surveyAccess";
import { surveyLoaders } from "../context";
import moment from 'moment';
import { EntityType, Resolvers, SurveyInstanceStatusEnum, SurveyRoles } from "../../generatedTypes";

const typeDefinition = "SurveyAccess";
const model = SurveyAccess;
const ResponseFactory = createResponseFactory(typeDefinition);
type SurveyContext = UserContext<surveyLoaders>;

export const surveyAccessResolver: Resolvers<SurveyContext> = {
    Query: {
        getSurveyAccessById: errorHandler(async (_, { id }, ctx) => {
            return (await ctx.loaders.surveyAccessLoader.load(id)) as SurveyAccess;
        }),
        getAllSurveyAccess: errorHandler(async (_, { input }, ctx) => {
            const surveyAccess = await model.findAll({
                where: {
                    ...input,
                },
            });
            return surveyAccess;
        }),
    },
    Mutation: {
        createSurveyAccess: errorHandler(async (_, { input }, ctx) => {
            const createdSurveyAccess = await model.create({
                entityId: input.entityId,
                entityType: EntityType.User,
                accessGrantorId: ctx.user.userId,
                surveyId: input.surveyId,
                role: input.role,
            });
            return ResponseFactory.successResponse('create', 1, [createdSurveyAccess.id.toString()]);
        }),
        createSurveyAccessWithSurveyInstance: errorHandler(async (_, { input }, ctx) => {
            console.log('invietMessage', input.invitationMessage);
            const existingSurveyAccess = await model.findOne({
                where: {
                    entityId: input.surveyAccess.entityId,
                    entityType: EntityType.User,
                    surveyId: input.surveyAccess.surveyId,
                    role: SurveyRoles.Responder,
                },
            });
            let accessId = existingSurveyAccess ? existingSurveyAccess.id : null;
            if (!existingSurveyAccess) {
                const createdSurveyAccess = await model.create({
                entityId: input.surveyAccess.entityId,
                entityType: EntityType.User,
                accessGrantorId: ctx.user.userId,
                surveyId: input.surveyAccess.surveyId,
                role: input.surveyAccess.role,
            });
            accessId = createdSurveyAccess.id;
            }
            let surveyInstance = {
                surveyAccessId: accessId,
                invitedById: ctx.user.userId,
                invitationDate: moment(input.invitationDate).utc(),
                invitationMessage: input.invitationMessage,
                status: SurveyInstanceStatusEnum.Awaiting,
                deadline: input.deadline ? moment(input.deadline).utc() : null,
            };

            await SurveyInstance.create(surveyInstance);
            return ResponseFactory.successResponse('create', 1, [accessId?.toString() || '']);
        }),
        updateSurveyAccessRoleById: errorHandler(async (_, {id, role}, ctx) => {
            const updatedSurveyAccess = await model.update({ role }, { where: { id } });
            return ResponseFactory.successResponse('update', updatedSurveyAccess[0], [id.toString()]);
        }),
        deleteSurveyAccessById: errorHandler(async (_, { id }, ctx) => {
            const deletedCount = await model.destroy({ where: { id } });
            return ResponseFactory.successResponse('delete', deletedCount, [id.toString()]);
        }),
    },
    SurveyAccess: {
        survey: async (parent, _args, ctx) => {
            return await Survey.findOne({
                where: {
                    id: parent.surveyId,
                },
            }) as Survey;
        },
        surveyInstances: async (parent, _args, ctx) => {
            const surveyInstances = await SurveyInstance.findAll({
                where: {
                    surveyAccessId: parent.id,
                },
            }) as SurveyInstance[];
            if (parent.entityId === ctx.user.userId) {return surveyInstances; }
            
            const invited = surveyInstances.filter((instance) => {
                return instance.invitedById === ctx.user.userId
            });
            return invited;
        },
    },
};

export default surveyAccessResolver;