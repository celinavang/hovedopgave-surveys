import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const surveyUserSchema: DocumentNode = gql`
    extend type Query {
        getAllSurveyUsersByUserId(userId: Int!): [SurveyAccess]
        getSurveyUserBySurveyId(surveyId: Int!): [SurveyAccess]
        getAllSurveyUsers(input: SurveyUserFilterOptions): [SurveyAccess]
    }

    extend type Mutation {
        createSurveyUser(input: SurveyUserCreateInput!): MessageResponse
        updateSurveyUserById(input: SurveyUserUpdateInput!): MessageResponse
        updateSurveyUserRoleById(id: Int!, role: SurveyRoles!): MessageResponse
        deleteSurveyUserById(id: Int!): MessageResponse
    }

    input SurveyUserCreateInput {
        userId: Int!
        role: SurveyRoles!
        surveyId: Int!
    }

    input SurveyUserUpdateInput {
        id: Int!
        role: SurveyRoles
    }

    type SurveyUser @key(fields: "id") @key(fields: "userId") {
        id: Int!
        userId: Int!
        role: SurveyRoles!
        surveyId: Int!
        survey: Survey!
        instances: [SurveyInstance!]
    }

    input SurveyUserFilterOptions {
        userId: Int
        role: SurveyRoles
        surveyId: Int
    }
`;