import { OpenAPIV3 } from 'openapi-types';

const login: OpenAPIV3.PathItemObject = {
    get: {
        security: [{ basicAuth: [] }],
        tags: ['User'],
        summary: 'Login',
        operationId: 'getUser',
        description: 'Retrieve a user with with a given email and password',
        responses: {
            ['200']: {
                description: 'Retrieve a user and its bearer token',
                content: {
                    ['application/json']: {
                        schema: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                },
            },
            ['4XX']: { description: 'Data validation error. See response for details.' },
        },
    },
};

export default login;
