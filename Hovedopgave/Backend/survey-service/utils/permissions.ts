import { IMiddlewareGenerator } from 'graphql-middleware';
import { surveyPermissionsHandler } from './permissionHandlers/surveyPermissionsHandler';
import { surveyInstancePermissionsHandler } from './permissionHandlers/surveyInstancePermissionsHandler';

const permissions = [surveyPermissionsHandler, surveyInstancePermissionsHandler].map(e => e.getShield()) as IMiddlewareGenerator<unknown, unknown, unknown>[];
export default permissions;