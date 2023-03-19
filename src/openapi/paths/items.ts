import { OpenAPIV3 } from 'openapi-types';

const items: OpenAPIV3.PathItemObject = {
    get: {
        tags: ['Items'],
        summary: 'Get all items',
        operationId: 'getAllItems',
        description: 'Get all items',
        responses: {
            ['200']: {
                description: 'List of items',
                content: {
                    ['application/json']: {
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Item',
                            },
                        },
                    },
                },
            },
            ['4XX']: { description: 'Data validation error. See response for details.' },
        },
    },
    post: {
        tags: ['Items'],
        security: [{ bearerAuth: [] }],
        summary: 'Create a new item',
        operationId: 'postItem',
        description: 'Create a new item',
        requestBody: {
            required: true,
            content: {
                ['application/json']: {
                    schema: {
                        $ref: '#/components/schemas/Item',
                    },
                },
            },
        },
        responses: {
            ['201']: {
                description: 'Item successfully created',
                content: {
                    ['application/json']: {
                        schema: {
                            $ref: '#/components/schemas/Item',
                        },
                    },
                },
            },
            ['4XX']: { description: 'Data validation error. See response for details.' },
        },
    },
};

export default items;
