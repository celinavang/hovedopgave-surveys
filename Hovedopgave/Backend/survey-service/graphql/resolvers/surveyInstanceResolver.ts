import { createResponseFactory, errorHandler, errorHandling, UserContext } from '@kintella/shared';
import SurveyInstance from "../../database/models/surveyInstance";
import { surveyLoaders } from "../context";
import SurveyAccess from "../../database/models/surveyAccess";
import { Resolvers, SurveyInstanceStatusEnum } from '../../generatedTypes';


const typeDefinition = "SurveyInstance";
type SurveyContext = UserContext<surveyLoaders>;
const model = SurveyInstance;
const ResponseFactory = createResponseFactory(typeDefinition);

export const surveyInstanceResolver: Resolvers<SurveyContext> = {
    Query: {
        getSurveyInstanceById: errorHandler(async (_, { id }, ctx) => {
            const surveyInstance = await ctx.loaders.surveyInstanceLoader.load(id) as SurveyInstance; 
            return surveyInstance;
        }),
        getSurveyInstancesBySurveyAccessId: errorHandler(async (_, { id }, ctx) => {
            const allIds = await ctx.loaders.surveyInstanceLoaderBySurveyAccessId.load(id) as SurveyInstance[];
            return await model.findAll({ where: { id: allIds, } }) as SurveyInstance[];
        }),
        getAllSurveyInstances: errorHandler(async (_, { input }, ctx) => {
                const surveyAccess = await SurveyAccess.findAll({
                    where: {
                        entityId: ctx.user.userId
                    },
                });
                const surveyAccessIds = surveyAccess.map((access) => access.id);
                const surveyInstances = await model.findAll({
                    where: {
                        ...input,
                        surveyAccessId: surveyAccessIds,
                    },
                });
                return surveyInstances;
            }
        ),
    },
    Mutation: {
        createSurveyInstance: errorHandling(async ({ input }) => {
            const instance = {
                ...input,
                invitationDate: input.invitationDate || new Date().toISOString(),
                status: SurveyInstanceStatusEnum.Awaiting,
            }
            const item = await model.create(instance);
            return ResponseFactory.successResponse('create', 1, [item.id.toString()]);
        }),
        updateSurveyInstanceById: errorHandling(async ({ id, input }) => {
            const [updatedSurveyInstance] = await model.update(input, { where: { id } });
            return updatedSurveyInstance;
        }),
        updateSurveyInstanceStatusById: errorHandling(async ({ id, status }) => {
            let changes: { status: SurveyInstanceStatusEnum; responseDate?: string } = {
                status,
            }
            if (status === SurveyInstanceStatusEnum.Completed) {
                changes = {
                    ...changes,
                    responseDate: new Date().toISOString(),
                }
            }
            const [updatedSurveyInstance] = await model.update(changes, { where: { id } });
            
            return updatedSurveyInstance;
        }),
        deleteSurveyInstanceById: errorHandling(async ({ id }) => {
            const deletedCount = await model.destroy({ where: { id } });
            return deletedCount > 0;
        }),
    },
    SurveyInstance: {
        surveyAccess: async (parent, _args, ctx) => {
            return await SurveyAccess.findOne({
                where: {
                    id: parent.surveyAccessId,
                },
            }) as SurveyAccess;
        }
    },
};

export default surveyInstanceResolver;