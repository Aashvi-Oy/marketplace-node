import { OpenAPIV3 } from 'openapi-types';

const BasicUser: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        name: { type: 'string', description: 'User name', default: '' },
        address: { type: 'string', description: 'User address', default: '' },
        phone: { type: 'string', description: 'User phone', default: '' },
    },
};

const PatchUser: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        ...BasicUser.properties,
        password: { type: 'string', description: 'User password' },
    },
};

const User: OpenAPIV3.SchemaObject = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        id: { type: 'integer', description: 'User ID' },
        email: { type: 'string', description: 'User email' },
        password: { type: 'string', description: 'User password' },
        ...BasicUser.properties,
    },
};

export { BasicUser, PatchUser, User };
