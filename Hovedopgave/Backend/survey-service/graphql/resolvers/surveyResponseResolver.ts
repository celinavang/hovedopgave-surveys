import { IResolvers } from "@graphql-tools/utils";
import SurveyResponse from "../../database/models/SurveyResponse";
import { createResponseFactory, errorHandling } from '@kintella/shared';
import SurveyQuestionOption from "../../database/models/surveyQuestionOption";
import Survey from "../../database/models/survey";
import SurveyQuestion from "../../database/models/surveyQuestion";
import SurveyInstance from "../../database/models/surveyInstance";

const typeDefinition = "SurveyResponse";
const model = SurveyResponse;
const ResponseFactory = createResponseFactory(typeDefinition);

export const surveyResponseResolver: IResolvers = {
    Query: {
        getSurveyResponseById: errorHandling(async ({ id }): Promise<SurveyResponse | null> => {
            return await model.findOne({
                where: { id },
            });
        }),
        getSurveyResponseByInstanceId: errorHandling(async ({ instanceId }): Promise<SurveyResponse[] | null> => {
            return await model.findAll({
                where: { instanceId },
            });
        }),
        getAllSurveyResponses: errorHandling(async ({ input }): Promise<SurveyResponse[] | null> => {
            if (!input) {
                return await model.findAll();
            }
            const items = await model.findAll({
                where: {
                    ...input,
                },
            });
            return items;
        }),
    },
    Mutation: {
        createSurveyResponse: errorHandling(async ({ input }) => {
            const item = await model.create(input);
            return item.id;
        }),
        bulkCreateSurveyResponse: errorHandling(async ({ input }) => {
            const items = await model.bulkCreate(input);
            return items.length;
        }),             
        deleteSurveyResponseById: errorHandling(async ({ id }) => { 
            const deletedCount = await model.destroy({ where: { id } });
            return deletedCount > 0;
        }),
    },
    SurveyResponse: {
        instance: async (parent: SurveyResponse) => {
            const instance = await SurveyInstance.findOne({
                where: {
                    id: parent.instanceId,
                }
            });
            return instance;
        },
        question: async (parent: SurveyResponse) => {
            return await SurveyQuestion.findOne({
                where: {
                    id: parent.questionId,
                }
            });
        },
        option: async (parent: SurveyResponse) => {
            return await SurveyQuestionOption.findOne({
                where: {
                    id: parent.optionId,
                }
            });
        }
    }
};

export default surveyResponseResolver;