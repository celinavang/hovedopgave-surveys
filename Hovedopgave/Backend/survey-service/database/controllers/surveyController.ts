import { IUserAccessClient, resolveAndFetchFilter, UserContext } from "@kintella/shared";
import { surveyLoaders } from "../../graphql/context";
import { Op, WhereOptions } from "sequelize";
import SurveyAccess from "../models/surveyAccess";
import { EntityType } from "../../generatedTypes";

export class SurveyController {
    protected userAccessClient?: IUserAccessClient | null = null;

    constructor(userAccessClient?: IUserAccessClient) {
        this.userAccessClient = userAccessClient;
    }

    public static async getAllSurveysFromContext(
        ctx: UserContext<surveyLoaders>,
        input: any
    ): Promise<number[]> {
        const [_, surveys] = await resolveAndFetchFilter<{ id: number }>(
            ctx.user.userId,
            ctx.user.companyId || null,
            input,
            // Surveys by userIds
            async (userIds, companyId) => {
                const surveyFromUserIds = await SurveyAccess.findAll({
                    where: {
                        entityType: EntityType.User,
                        entityId: userIds,
                    }
                });
                return surveyFromUserIds.map((surveyAccess) => ({ id: surveyAccess.surveyId }));
            },
            // Surveys by groupIds
            async (groupIds, companyId) => {
                const surveyFromGroupIds = await SurveyAccess.findAll({
                    where: {
                        entityType: EntityType.Group,
                        entityId: groupIds,
                    },
                });
                return surveyFromGroupIds.map((surveyAccess) => ({ id: surveyAccess.surveyId }));
            }
        );
        return surveys.map((survey) => survey.id);
    }
}