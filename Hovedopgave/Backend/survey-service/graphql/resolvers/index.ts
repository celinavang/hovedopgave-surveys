import { mergeResolvers } from '@graphql-tools/merge';
import { GraphQLResolverMap } from '@apollo/subgraph/dist/schema-helper';
import {surveyResolver} from './surveyResolver';
import {surveyAccessResolver} from './surveyAccessResolver';
import { surveyInstanceResolver } from './surveyInstanceResolver';
import { surveyResponseResolver } from './surveyResponseResolver';

const resolvers = [
    surveyResolver,
    surveyAccessResolver,
    surveyInstanceResolver,
    surveyResponseResolver,
];

export default mergeResolvers(resolvers) as GraphQLResolverMap<unknown>;
