import { OpenAPIV3 } from 'openapi-types';

const register: OpenAPIV3.PathItemObject = {
    post: {
        tags: ['User'],
        summary: 'Register',
        operationId: 'postUser',
        description: 'Register a user with a given email and password',
        requestBody: {
            required: true,
            content: {
                ['application/json']: {
                    schema: {
                        $ref: '#/components/schemas/User',
                    },
                },
            },
        },
        responses: {
            ['201']: {
                description: 'User successfully registered',
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

export default register;
