import DataLoader from 'dataloader';
import Survey from '../../database/models/survey';
import { CacheEntityAccess, EntityAccessInput, KintellaRoleEnum, SurveyAccessFilterOptions, SurveyActions, SurveyRoles, SurveyStatusEnum } from '../../generatedTypes';
import { AuthenticatedUser, UserContext } from '@kintella/shared';
import { PC } from '../../database/controllers/privilegeController';
import SurveySection from '../../database/models/surveySection';
import SurveyQuestion from '../../database/models/surveyQuestion';
import SurveyQuestionOption from '../../database/models/surveyQuestionOption';
import SurveyAccess from '../../database/models/surveyAccess';
import SurveyInstance from '../../database/models/surveyInstance';

type CompositeKey = { entityId: number | null; itemId: number | null};

export const actionsMatrix: Record<SurveyStatusEnum, Record<SurveyActions, 1 | 0>> = {
    [SurveyStatusEnum.Draft]: { CREATE: 1, READ: 1, EDIT: 1, DELETE: 1, INVITE: 0, SHARE: 1 },
    [SurveyStatusEnum.Published]: { CREATE: 1, READ: 1, EDIT: 0, DELETE: 0, INVITE: 1, SHARE: 1 },
    [SurveyStatusEnum.Template]: { CREATE: 1, READ: 1, EDIT: 1, DELETE: 1, INVITE: 0, SHARE: 1 },
};

export interface surveyLoaders {
    surveyLoader: DataLoader<number, Survey | null>;
    surveySectionLoader: DataLoader<number, SurveySection | null>;
    surveySectionBySurveyIdLoader: DataLoader<number, SurveySection[] | null>;
    surveyQuestionLoader: DataLoader<number, SurveyQuestion | null>;
    surveyQuestionBySectionIdLoader: DataLoader<number, SurveyQuestion[] | null>;
    surveyQuestionOptionLoader: DataLoader<number, SurveyQuestionOption | null>;
    surveyQuestionOptionByQuestionIdLoader: DataLoader<number, SurveyQuestionOption[] | null>;
    surveyAccessLoader: DataLoader<number, SurveyAccess | null>;
    surveyAccessBySurveyIdLoader: DataLoader<number, SurveyAccess[] | null>;
    surveyAccessByEntityIdLoader: DataLoader<number, SurveyAccess[] | null>;
    surveyAccessByEntityIdAndSurveyIdLoader: DataLoader<CompositeKey, SurveyAccess | null>;
    surveyInstanceLoader: DataLoader<number, SurveyInstance | null>;
    surveyInstanceLoaderBySurveyAccessId: DataLoader<number, SurveyInstance[] | null>;
    getEntityAccessLoader: DataLoader<EntityAccessInput, CacheEntityAccess | null>;
    getActionsForRole: DataLoader<{ role: SurveyRoles; surveyId: number }, SurveyActions[] | null>;
}

export const loaders = (authUser?: AuthenticatedUser): surveyLoaders => ({
    surveyLoader: new DataLoader(async (keys: readonly number[]) => {
        const survey = await Survey.findAll({
            where: {
                id: keys,
            },
        });
        return keys.map(id => survey.find(d => id === d.id) || null);
    }),
    surveySectionLoader: new DataLoader(async (keys: readonly number[]) => {
        const section = await SurveySection.findAll({
            where: {
                id: keys,
            },
        });
        return keys.map(id => section.find(d => id === d.id) || null);
    }),
    surveySectionBySurveyIdLoader: new DataLoader(async (keys: readonly number[]) => {
        const sections = await SurveySection.findAll({
            where: {
                surveyId: keys,
            },
        });
        return keys.map(id => sections.filter(d => id === d.surveyId) || null);
    }),
    surveyQuestionLoader: new DataLoader(async (keys: readonly number[]) => {
        const question = await SurveyQuestion.findAll({
            where: {
                id: keys,
            },
        });
        return keys.map(id => question.find(d => id === d.id) || null);
    }),
    surveyQuestionBySectionIdLoader: new DataLoader(async (keys: readonly number[]) => {
        const questions = await SurveyQuestion.findAll({
            where: {
                sectionId: keys,
            },
        });
        return keys.map(id => questions.filter(d => id === d.sectionId) || null);
    }),
    surveyQuestionOptionLoader: new DataLoader(async (keys: readonly number[]) => {
        const questionOption = await SurveyQuestionOption.findAll({
            where: {
                id: keys,
            },
        });
        return keys.map(id => questionOption.find(d => id === d.id) || null);
    }),
    surveyQuestionOptionByQuestionIdLoader: new DataLoader(async (keys: readonly number[]) => {
        const questionOptions = await SurveyQuestionOption.findAll({
            where: {
                questionId: keys,
            },
        });
        return keys.map(id => questionOptions.filter(d => id === d.questionId) || null);
    }),
    surveyAccessLoader: new DataLoader(async (keys: readonly number[]) => {
        const surveyAccess = await SurveyAccess.findAll({
            where: {
                id: keys,
            },
        });
        return keys.map(id => surveyAccess.find(d => id === d.id) || null);
    }),
    surveyAccessBySurveyIdLoader: new DataLoader(async (keys: readonly number[]) => {
        const surveyAccess = await SurveyAccess.findAll({
            where: {
                surveyId: keys,
            },
        });
        return keys.map(id => surveyAccess.filter(d => id === d.surveyId) || null);
    }),
    surveyAccessByEntityIdLoader: new DataLoader(async (keys: readonly number[]) => {
        const surveyAccess = await SurveyAccess.findAll({
            where: {
                entityId: keys,
            },
        });
        return keys.map(id => surveyAccess.filter(d => id === d.entityId) || null);
    }),
    surveyAccessByEntityIdAndSurveyIdLoader: new DataLoader(async (keys: readonly CompositeKey[]) => {
        const surveyAccesses = await SurveyAccess.findAll({
            where: {
                entityId: keys.map(key => key.entityId),
                surveyId: keys.map(key => key.itemId),
            },
        });
        return keys.map(key =>
            surveyAccesses.find(
                sa => sa.entityId === key.entityId && sa.surveyId === key.itemId
            ) || null
        );
    }),
    surveyInstanceLoader: new DataLoader(async (keys: readonly number[]) => {
        const surveyInstance = await SurveyInstance.findAll({
            where: {
                id: keys,
            },
        });
        return keys.map(id => surveyInstance.find(d => id === d.id) || null);
    }),
    surveyInstanceLoaderBySurveyAccessId: new DataLoader(async (keys: readonly number[]) => {
        const surveyInstances = await SurveyInstance.findAll({
            where: {
                surveyAccessId: keys,
            },
        });
        return keys.map(id => surveyInstances.filter(d => id === d.surveyAccessId) || null);
    }),
    getEntityAccessLoader: new DataLoader(async (keys: readonly EntityAccessInput[]) => {
        const roles = await PC.getRoles({
            entities: [...keys],
            ctx: { user: authUser } as UserContext<surveyLoaders>,
        });
        return keys.map(key => {
            const entity = roles.find(r => r.entityId === key.entityId && r.entityType === key.entityType);
            return {
                entityId: key.entityId,
                entityType: key.entityType,
                role: entity?.role || KintellaRoleEnum.External,
            }; 
        });
    }),
    getActionsForRole: new DataLoader(async (keys: readonly { role: SurveyRoles; surveyId: number }[]) => {
        const results = await Promise.all(keys.map(async (key) => {
            const role = key.role;
            const actions = await PC.getActionsForPrivilege(role);
            const survey = await Survey.findByPk(key.surveyId);
            const actionsForStatus = actionsMatrix[survey?.status || SurveyStatusEnum.Draft];
            return actions.filter(action => actionsForStatus[action] === 1) as SurveyActions[];
        }));
        return results;
    }),
});

export default ({ req }: any) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null;
    return user;
};