import { OpenAPIV3 } from 'openapi-types';

export const health: OpenAPIV3.PathItemObject = {
    get: {
        tags: ['Health'],
        summary: 'Check health',
        operationId: 'getHealth',
        description: 'Check application health',
        responses: {
            ['200']: {
                description: 'Health check',
                content: {
                    ['application/json']: {
                        schema: {
                            properties: {
                                message: { type: 'string', description: 'Message' },
                            },
                        },
                    },
                },
            },
            ['4XX']: { description: 'Data validation error. See response for details.' },
        },
    },
};
