import { AbstractRoleMatrixManager, EntityAccess, IUserAccessClient, PrivilegeManager, UserAccessClient, UserContext } from "@kintella/shared";
import { EntityType, KintellaRoleEnum, SurveyActions, SurveyRoles } from "../../generatedTypes";
import { surveyPrivilegesHierarchy } from "../../utils/privilegeUtils";
import { surveyRoleMatrix } from "../../utils/surveyRoleMatrix";

interface EntInfo {
    entityId: number;
    entityType: EntityType;
    surveyRole: SurveyRoles;
}

export const privilegeMatrix: Record<SurveyRoles, Record<SurveyActions, 1 | 0>> = {
    [SurveyRoles.Creator]: { CREATE: 1, READ: 1, EDIT: 1, DELETE: 1, INVITE: 1, SHARE: 1 },
    [SurveyRoles.Editor]: { CREATE: 0, READ: 1, EDIT: 1, DELETE: 0, INVITE: 1, SHARE: 0 },
    [SurveyRoles.Responder]: { CREATE: 0, READ: 1, EDIT: 0, DELETE: 0, INVITE: 0, SHARE: 0 },
    [SurveyRoles.Reviewer]: { CREATE: 0, READ: 1, EDIT: 0, DELETE: 0, INVITE: 1, SHARE: 0 },
}

class PM extends PrivilegeManager<SurveyRoles, SurveyActions> {
    public hierarchy = surveyPrivilegesHierarchy;

    public privilegesWithActions = (...actions: SurveyActions[]) => {
        return Object.values(SurveyRoles).filter(p => actions.every(a => privilegeMatrix[p][a] === 1));
    };

    public getActionsForPrivilege = (privilege: SurveyRoles): SurveyActions[] => {
        return (Object.keys(privilegeMatrix[privilege]) as SurveyActions[]).filter(
            a => privilegeMatrix[privilege][a as SurveyActions] === 1
        );
    };

    public getActionsForRole = async (role: KintellaRoleEnum, entityType: EntityType) => {
        return Object.values(SurveyActions).filter(a => surveyRoleMatrix[entityType]?.[role][a] === 1) as SurveyActions[];
    }

    private async getRole(ctx: UserContext<object>, entityId: number, entityType: EntityType) {
        const roles = await this.getRoles({ entities: [{ entityId, entityType }], ctx });

        const { role } = roles[0];
        ctx.entityAccess.set(entityId, entityType, role, true);
        if (!role) {
            throw new Error(`No role found for entity ${entityId} of type ${entityType}`);
        }
        const allRoles = roles.map(r => r.role);
        return allRoles;
    }
    public transform = (entities: EntInfo | EntInfo[] ) => {
        if (Array.isArray(entities)) return entities;
        if (Array.isArray(entities.entityId)) {
            return entities.entityId.map(id => ({
                entityId: id,
                entityType: entities.entityType,
            })) as EntInfo[];
        }
        return [entities] as EntInfo[];
    };
    public async canPerformActionWithRole(
        action: SurveyActions,
        ctx: UserContext<object>,
        {entityId, entityType}: EntInfo
    ) {
        const allRoles = await this.getRole(ctx, entityId, entityType);
        const role = allRoles[0];
        return (await this.getActionsForRole(role, entityType)).includes(action);
    }

    public async canPerformAction(
        action: SurveyActions,
        ctx: UserContext<object>,
        {entityId, entityType, surveyRole}: EntInfo
    ) {
        const roles = await this.getRole(ctx, entityId, entityType);
        
        return this.checkPermission(action, surveyRole, privilegeMatrix, {
            entityId,
            entityType,
            role: roles[0]
        });
    }   
}

export const PC = new PM(new UserAccessClient());