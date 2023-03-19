import { OpenAPIV3 } from 'openapi-types';

const user: OpenAPIV3.PathItemObject = {
    patch: {
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        operationId: 'patchUser',
        summary: 'Update user',
        description: 'Update logged in user information',
        requestBody: {
            required: true,
            content: {
                ['application/json']: {
                    schema: {
                        $ref: '#/components/schemas/PatchUser',
                    },
                },
            },
        },
        responses: {
            ['200']: {
                description: 'User successfully updated',
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
    delete: {
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete user',
        operationId: 'deleteUser',
        description: 'Delete logged in user',
        responses: {
            ['200']: {
                description: 'User successfully updated',
                content: {
                    ['application/json']: {
                        schema: {
                            properties: {
                                message: { type: 'string', description: 'User deleted successfully' },
                            },
                        },
                    },
                },
            },
        },
    },
};

export default user;
