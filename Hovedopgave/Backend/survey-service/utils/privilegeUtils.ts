import { SurveyActions, SurveyRoles } from "../generatedTypes";

export const CREATE_READ_EDIT_DELETE: Record<SurveyActions, 1 | 0> = {
    CREATE: 1,
    READ: 1,
    DELETE: 1,
    EDIT: 1,
    INVITE: 1,
    SHARE: 1,
}

export const CREATE_READ_EDIT: Record<SurveyActions, 1 | 0> = {
    CREATE: 1,
    READ: 1,
    DELETE: 0,
    EDIT: 1,
    INVITE: 1,
    SHARE: 0,
}

export const READ_EDIT: Record<SurveyActions, 1 | 0> = {
    CREATE: 0,
    READ: 1,
    DELETE: 0,
    EDIT: 1,
    INVITE: 1,
    SHARE: 0,
}
export const READ: Record<SurveyActions, 1 | 0> = {
    CREATE: 0,
    READ: 1,
    DELETE: 0,
    EDIT: 0,
    INVITE: 1,
    SHARE: 0,
}

export const NONE: Record<SurveyActions, 1 | 0> = {
    CREATE: 0,
    READ: 0,
    DELETE: 0,
    EDIT: 0,
    INVITE: 0,
    SHARE: 0,
}

export const surveyPrivilegesHierarchy: Record<SurveyRoles, number> = {
    [SurveyRoles.Creator]: 3,
    [SurveyRoles.Editor]: 2,
    [SurveyRoles.Responder]: 1,
    [SurveyRoles.Reviewer]: 0,
};