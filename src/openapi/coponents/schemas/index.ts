import { OpenAPIV3 } from 'openapi-types';

import { Error } from './error';
import { BasicItem, Item } from './items';
import { BasicUser, User, PatchUser } from './users';

export const schemas: { [schemaName: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject } = {
    BasicUser,
    User,
    PatchUser,
    BasicItem,
    Item,
    Error,
};
