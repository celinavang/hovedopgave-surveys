import { PermissionHandler, ResolverGroups } from "@kintella/shared";
import context, { surveyLoaders } from "../../graphql/context";
import { EntityType, MutationDeleteSurveyInstanceByIdArgs, MutationUpdateSurveyInstanceByIdArgs, QueryGetAllSurveyInstancesArgs, QueryGetSurveyInstanceByIdArgs, SurveyActions, SurveyInstanceStatusEnum, SurveyRoles } from "../../generatedTypes";
import SurveyAccess from "../../database/models/surveyAccess";
import { PC } from "../../database/controllers/privilegeController";
import SurveyInstance from "../../database/models/surveyInstance";

export class SurveyInstancePermissionsHandler extends PermissionHandler<surveyLoaders> {
    protected makeShield(): ResolverGroups {
        return {
            Query: {
                getSurveyInstanceById: this.authAnd(this.getSurveyInstanceById),
                getAllSurveyInstances: this.authAnd(this.getAllSurveyInstances)
            },
            Mutation: {
                updateSurveyInstanceById: this.authAnd(this.updateSurveyInstance),
                deleteSurveyInstanceById: this.authAnd(this.deleteSurveyInstance),
            }
        };
    }
    private getSurveyInstanceById = this.makeRule<QueryGetSurveyInstanceByIdArgs>(async (_, { id }, ctx) => {
        
        const instance = await ctx.loaders.surveyInstanceLoader.load(id);
        console.log('instance', instance?.surveyAccessId);
        const surveyAccess = await SurveyAccess.findOne({
            where: {
                id: instance?.surveyAccessId,
            }
        });
        if (instance?.invitedById === ctx.user.userId || surveyAccess?.entityId === ctx.user.userId) {
            return true;
        }
        return false;
        });
    private getAllSurveyInstances = this.makeRule<QueryGetAllSurveyInstancesArgs>(async (__, { input }, ctx) => {
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
    private updateSurveyInstance = this.makeRule<MutationUpdateSurveyInstanceByIdArgs>(async (_, { id, input }, ctx) => {
        if (!id) {
            return false;
        }
        const instance = await SurveyInstance.findOne({
            where: {
                id: id,
            },
        });
        const surveyAccess = await SurveyAccess.findOne({
            where: {
                id: instance?.surveyAccessId,
            }
        });

        if (instance?.status !== SurveyInstanceStatusEnum.Awaiting) {
            return false;
        }

        const access = await SurveyAccess.findAll({
            where: {
                entityId: ctx.user.userId,
                surveyId: surveyAccess?.surveyId || 0,

            },
        });
        const checkedAcccess = await Promise.all(
            access.map(async a => PC.canPerformAction(SurveyActions.Edit, ctx, { entityId: a.entityId, entityType: EntityType.User, surveyRole: a.role as SurveyRoles }))
        );
        return checkedAcccess.some(a => a);
    });
    private deleteSurveyInstance = this.makeRule<MutationDeleteSurveyInstanceByIdArgs>(async (_, { id }, ctx) => {
        const instance = await ctx.loaders.surveyInstanceLoader.load(id);
        if (instance?.status !== SurveyInstanceStatusEnum.Awaiting) {
            return false;
        }
        const surveyAccess = await SurveyAccess.findOne({
            where: {
                id: instance?.surveyAccessId,
            }
        });
        const access = await SurveyAccess.findAll({
            where: {
                entityId: ctx.user.userId,
                surveyId: surveyAccess?.surveyId || 0,
            },
        });
        const checkedAccess = await Promise.all(
            access.map(async a => PC.canPerformAction(SurveyActions.Delete, ctx, { entityId: a.entityId, entityType: EntityType.User, surveyRole: a.role as SurveyRoles }))
        );
        return checkedAccess.some(a => a);
    });
}

export const surveyInstancePermissionsHandler = new SurveyInstancePermissionsHandler();