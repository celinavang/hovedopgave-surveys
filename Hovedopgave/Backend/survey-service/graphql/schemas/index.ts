import { DocumentNode } from 'graphql';
import { rootSchema } from '@kintella/shared';
import { surveySchema } from './surveySchema';
import { surveyUserSchema } from './surveyUserSchema';
import { surveyInstanceSchema } from './surveyInstanceSchema';
import { surveyResponseSchema } from './surveyResponseSchema';
import { SurveyAccessSchema } from './surveyAccessSchema';

export default [
    rootSchema,
    surveySchema,
    surveyUserSchema,
    surveyInstanceSchema,
    surveyResponseSchema,
    SurveyAccessSchema
] as DocumentNode[];
