import { OpenAPIV3 } from 'openapi-types';

import { health } from './health';
import items from './items';
import itemsId from './items/{id}';
import login from './login';
import register from './register';
import user from './user';

export const paths: OpenAPIV3.PathsObject = {
    '/health': health,

    '/user/login': login,
    '/user/register': register,

    '/user': user,
    '/items': items,
    '/items/{id}': itemsId,
};
