import 'dotenv/config';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { applyMiddleware } from 'graphql-middleware';
import { ServiceConfig, UserContextFactory, Server, applyMiddlewareCustom } from '@kintella/shared';
import bodyParser from 'body-parser';
import permissions from './utils/permissions';

import typeDefs from './graphql/schemas';
import resolvers from './graphql/resolvers';
import { loaders, surveyLoaders } from './graphql/context';

import db from './database/models';

const PORT = process.env.PORT || ServiceConfig.getPort('survey');
const HOST = process.env.HOST || 'localhost';

const startServer = async () => {
    const _server = new Server(PORT, HOST, db as any);
    
    if (db.sequelize) {
        await db.sequelize.authenticate();
    }

    const app = _server.getApp();
    app.use(bodyParser.json());

    const schema = buildSubgraphSchema({ typeDefs, resolvers });
    const schemaWithMiddleware = applyMiddlewareCustom(schema, permissions);

    await _server.startServer<surveyLoaders>(schemaWithMiddleware, new UserContextFactory(loaders).getUserContext);
};

startServer();
