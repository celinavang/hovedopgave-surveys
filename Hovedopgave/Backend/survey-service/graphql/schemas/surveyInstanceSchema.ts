import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const surveyInstanceSchema: DocumentNode = gql`
    extend type Query {
        getSurveyInstanceById(id: Int!): SurveyInstance
        getSurveyInstancesBySurveyAccessId(id: Int!): [SurveyInstance!]
        getAllSurveyInstances(input: SurveyInstanceFilterOptions): [SurveyInstance!]
    }

    extend type Mutation {
        createSurveyInstance(input: SurveyInstanceCreateInput!): MessageResponse
        updateSurveyInstanceById(id: Int!, input: SurveyInstanceUpdateInput!): MessageResponse
        updateSurveyInstanceStatusById(id: Int!, status: SurveyInstanceStatusEnum!): MessageResponse
        deleteSurveyInstanceById(id: Int!): MessageResponse
    }

    input SurveyInstanceCreateInput {
        surveyAccessId: Int!
        invitedById: Int
        deadline: String
        invitationDate: String
        responseDate: String
        invitationMessage: String
    }

    input SurveyInstanceUpdateInput {
        id: Int!
        deadline: String
        status: SurveyInstanceStatusEnum
        responseDate: String
        invitationMessage: String
    }

    input SurveyInstanceFilterOptions {
        surveyAccessId: Int
        status: SurveyInstanceStatusEnum
        invitationDate: String
        responseDate: String
    }

    type SurveyInstance @key(fields: "id") @key(fields: "surveyAccessId") @key(fields: "invitedById") {
        id: Int!
        surveyAccessId: Int!
        surveyAccess: SurveyAccess!
        invitedById: Int
        deadline: String
        status: SurveyInstanceStatusEnum!
        invitationDate: String!
        responseDate: String
        invitationMessage: String
    }

    enum SurveyInstanceStatusEnum {
        AWAITING
        COMPLETED
    }
    `;