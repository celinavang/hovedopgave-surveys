import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

export const surveySchema: DocumentNode = gql`
    extend type Query {
        getSurveyById(id: Int!): Survey
        getAllSurveys(input: SurveyFilterOptions): [Survey]
    }

    extend type Mutation {
        createSurvey(input: SurveyInput!): MessageResponse
        updateSurveyById(id: Int!, input: SurveyInput!): MessageResponse
        deleteSurveyById(id: Int!): MessageResponse
    }
    
    type Survey @key(fields: "id") @key(fields: "creatorId") {
        id: Int!
        creatorId: Int! 
        title: String!
        description: String!
        timeEstimate: String
        status: SurveyStatusEnum!
        anonymous: Boolean
        sections: [SurveySection]
        createdAt: String
        updatedAt: String
        surveyAccess: [SurveyAccess]
        surveyInstances: [SurveyInstance]
        accessType: SurveyRoles
        accessActions: [SurveyActions]
    }

    type SurveySection @key(fields: "id") @key(fields: "surveyId") {
        id: Int!
        surveyId: Int!
        survey: Survey
        title: String!
        description: String!
        position: Int!
        questions: [SurveyQuestion]
    }

    type SurveyQuestion @key(fields: "id") @key(fields: "sectionId") {
        id: Int!
        sectionId: Int!
        section: SurveySection
        question: String!
        description: String
        type: QuestionTypeEnum
        required: Boolean
        position: Int!
        questionOptions: [SurveyQuestionOption]
    }

    type SurveyQuestionOption {
        id: Int!
        questionId: Int!
        text: String!
        position: Int!
    }

    input SurveyInput {
        id: Int
        creatorId: Int!
        title: String!
        description: String!
        status: SurveyStatusEnum!
        anonymous: Boolean
        timeEstimate: String
        sections: [SurveySectionInput]
        surveyAccess: [SurveyAccessInput]
    }

    input SurveySectionInput {
        id: Int
        title: String!
        description: String!
        questions: [SurveyQuestionInput]
    }

    input SurveyQuestionInput {
        id: Int
        question: String!
        description: String
        type: QuestionTypeEnum!
        required: Boolean
        questionOptions: [SurveyQuestionOptionInput]
    }

    input SurveyQuestionOptionInput {
        id: Int
        questionId: Int
        text: String!
    }

    input SurveyFilterOptions {
        creatorId: Int
        status: SurveyStatusEnum
    }

    enum SurveyActions{
        CREATE
        READ
        EDIT
        DELETE
        INVITE
        SHARE
    }

    enum SurveyStatusEnum {
        DRAFT
        PUBLISHED
        TEMPLATE
    }

    enum QuestionTypeEnum {
        SINGLE
        TEXTSECTION
        RATING
        TEXTINPUT
        LIKERT
    }

`;
