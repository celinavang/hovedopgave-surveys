import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const surveyResponseSchema: DocumentNode = gql`
    extend type Query {
        getSurveyResponseById(id: Int!): SurveyResponse
        getSurveyResponseByInstanceId(instanceId: Int!): [SurveyResponse!]
        getAllSurveyResponses(input: SurveyResponseFilterOptions): [SurveyResponse!]
    }

    extend type Mutation {
        createSurveyResponse(input: SurveyResponseCreateInput!): MessageResponse
        bulkCreateSurveyResponse(input: [SurveyResponseCreateInput!]!): MessageResponse
        deleteSurveyResponseById(id: Int!): MessageResponse
    }

    input SurveyResponseCreateInput {
        instanceId: Int!
        questionId: Int!
        optionId: Int
        userInput: String
    }

    input SurveyResponseFilterOptions {
        instanceId: Int
        questionId: Int
        optionId: Int
    }

    type SurveyResponse {
        id: Int!
        instanceId: Int!
        instance: SurveyInstance!
        questionId: Int!
        question: SurveyQuestion!
        optionId: Int
        option: SurveyQuestionOption
        userInput: String
    }
    `;