import { SurveyRoles, SurveyStatusEnum } from "../graphql/__generated__/graphql";

export const translateSurveyAccessRole = (role: SurveyRoles) => {
    switch (role) {
        case SurveyRoles.Creator:
            return 'Opretter';
        case SurveyRoles.Editor:
            return 'Redaktør';
        case SurveyRoles.Reviewer:
            return 'Visningsadgang';
        case SurveyRoles.Responder:
            return 'Besvarer';
        default:
            return 'Ukendt rolle';
    }
}

export const translateSurveyStatus = (status: SurveyStatusEnum) => {
    switch (status) {
        case SurveyStatusEnum.Draft:
            return 'Kladde';
        case SurveyStatusEnum.Published:
            return 'Offentliggjort';
        case SurveyStatusEnum.Template:
            return 'Skabelon';
        default:
            return 'Ukendt status';
    }
}

export const surveyEmployeeRoles = [
    {
        label: translateSurveyAccessRole(SurveyRoles.Editor),
        value: SurveyRoles.Editor,
    },
    {
        label: translateSurveyAccessRole(SurveyRoles.Reviewer),
        value: SurveyRoles.Reviewer,
    }
]