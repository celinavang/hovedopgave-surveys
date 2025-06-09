import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const SurveyAccessSchema: DocumentNode = gql`
    extend type Query {
        getSurveyAccessById(id: Int!): SurveyAccess
        getAllSurveyAccess(input: SurveyAccessFilterOptions): [SurveyAccess]
    }
    extend type Mutation {
        createSurveyAccess(input: SurveyAccessInput!): MessageResponse
        createSurveyAccessWithSurveyInstance(input: SurveyAccessInputWithSurveyInstance!): MessageResponse
        updateSurveyAccessById(input: SurveyAccessInput!): MessageResponse
        updateSurveyAccessRoleById(id: Int!, role: SurveyRoles!): MessageResponse
        deleteSurveyAccessById(id: Int!): MessageResponse
    }

    input SurveyAccessFilterOptions {
        id: Int
        entityType: EntityType
        entityId: Int
        role: SurveyRoles
        surveyId: Int
    }

    input SurveyAccessInput {
        id: Int
        entityId: Int!
        entityType: EntityType!
        accessGrantorId: Int!
        surveyId: Int #item id?
        role: SurveyRoles!
    }

    input SurveyAccessInputWithSurveyInstance {
        surveyAccess: SurveyAccessInput!
        deadline: String
        invitationDate: String
        invitationMessage: String
    }

    type SurveyAccess @key(fields: "id") @key(fields: "entityId") @key(fields: "accessGrantorId") @key(fields: "surveyId") {
        id: Int!
        entityId: Int!
        entityType: EntityType!
        accessGrantorId: Int!
        surveyId: Int!
        survey: Survey
        surveyInstances: [SurveyInstance]
        role: SurveyRoles!
    }

    type SurveyResponseAccess @key(fields: "id") @key(fields: "entityId") @key(fields: "accessGrantorId") @key(fields: "accessId") {
        id: Int!
        entityId: Int!
        entityType: EntityType!
        accessGrantorId: Int!
        accessId: Int!
        surveyAccess: SurveyAccess
        surveyInstances: [SurveyInstance]
    }
    
    enum SurveyRoles {
        CREATOR
        EDITOR
        REVIEWER
        RESPONDER
    }
`

