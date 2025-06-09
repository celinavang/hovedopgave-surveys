import { PermissionHandler, ResolverGroups } from "@kintella/shared";
import { surveyLoaders } from "../../graphql/context";
import { EntityType, MutationCreateSurveyArgs, MutationDeleteSurveyByIdArgs, MutationUpdateSurveyByIdArgs, QueryGetAllSurveysArgs, QueryGetSurveyByIdArgs, SurveyActions, SurveyRoles } from "../../generatedTypes";
import { PC } from "../../database/controllers/privilegeController";
import SurveyAccess from "../../database/models/surveyAccess";


export class SurveyPermissionsHandler extends PermissionHandler<surveyLoaders> {
    protected makeShield(): ResolverGroups {
        return {
            Query: {
                getSurveyById: this.authAnd(this.getSurveyById),
                getAllSurveys: this.authAnd(this.getAllSurveys),
            },
            Mutation: {
                createSurvey: this.authAnd(this.createSurvey),
                updateSurveyById: this.authAnd(this.updateSurvey),
                deleteSurveyById: this.authAnd(this.deleteSurvey),
            }
        };
    }
    private getSurveyById = this.makeRule<QueryGetSurveyByIdArgs>(async (_, { id }, ctx) => {
        const access = await SurveyAccess.findAll({
            where: {
                entityId: ctx.user.userId,
                surveyId: id,
            },
        });
        const checkedAccess = await Promise.all(
            access.map(async a => PC.canPerformAction(SurveyActions.Read, ctx, { entityId: a.entityId, entityType: EntityType.User, surveyRole: a.role as SurveyRoles }))
        );
        return checkedAccess.some(a => a);
    });
    private getAllSurveys = this.makeRule<QueryGetAllSurveysArgs>(async (_, { input }, ctx) => {
        const access = await SurveyAccess.findAll({
            where: {
                entityId: ctx.user.userId,
            }
        });
        const checkedAccess = await Promise.all(
            access.map(async a => PC.canPerformAction(SurveyActions.Read, ctx, { entityId: a.entityId, entityType: EntityType.User, surveyRole: a.role as SurveyRoles }))
        );
        return checkedAccess.some(a => a);
    });
    private createSurvey = this.makeRule<MutationCreateSurveyArgs>(async (_, { input }, ctx) => {
        return PC.canPerformActionWithRole(SurveyActions.Create, ctx, { entityId: ctx.user.userId, entityType: EntityType.User, surveyRole: SurveyRoles.Creator });
    });
    private updateSurvey = this.makeRule<MutationUpdateSurveyByIdArgs>(async (_, { input }, ctx) => {
        if (!input.id) {
            return false;
        }
        const survey = await ctx.loaders.surveyLoader.load(input.id);
        if (survey?.status !== "DRAFT" && survey?.status !== "TEMPLATE") {
            return false;
        }
        const access = await SurveyAccess.findAll({
            where: {
                entityId: ctx.user.userId,
                surveyId: input.id,
            },
        });
        const checkedAccess = await Promise.all(
            access.map(async a => PC.canPerformAction(SurveyActions.Edit, ctx, { entityId: a.entityId, entityType: EntityType.User, surveyRole: a.role as SurveyRoles }))
        );
        return checkedAccess.some(a => a);
    });
    private deleteSurvey = this.makeRule<MutationDeleteSurveyByIdArgs>(async (_, { id }, ctx) => {
        const survey = await ctx.loaders.surveyLoader.load(id);
        if (survey?.status !== "DRAFT" && survey?.status !== "TEMPLATE") {
            return false;
        }
        const access = await SurveyAccess.findAll({
            where: {
                entityId: ctx.user.userId,
                surveyId: id,
            },
        });
        const checkedAccess = await Promise.all(
            access.map(async a => PC.canPerformAction(SurveyActions.Delete, ctx, { entityId: a.entityId, entityType: EntityType.User, surveyRole: a.role as SurveyRoles }))
        );
        return checkedAccess.some(a => a);
    });
}

export const surveyPermissionsHandler = new SurveyPermissionsHandler();