import { OpenAPIV3 } from 'openapi-types';

const itemsId: OpenAPIV3.PathItemObject = {
    get: {
        tags: ['Items'],
        summary: 'Get an item',
        operationId: 'getItem',
        description: 'Get all items',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Item ID' }],
        responses: {
            ['200']: {
                description: 'List of items',
                content: {
                    ['application/json']: {
                        schema: {
                            $ref: '#/components/schemas/Item',
                        },
                    },
                },
            },
            ['4XX']: {
                description: 'Data validation error. See response for details.',
                content: {
                    ['application/json']: {
                        schema: {
                            $ref: '#/components/schemas/Error',
                        },
                    },
                },
            },
        },
    },
    patch: {
        tags: ['Items'],
        security: [{ bearerAuth: [] }],
        operationId: 'patchItem',
        summary: 'Update an item',
        description: 'Update an item',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Item ID' }],
        requestBody: {
            required: true,
            content: {
                ['application/json']: {
                    schema: {
                        $ref: '#/components/schemas/BasicItem',
                    },
                },
            },
        },
        responses: {
            ['200']: {
                description: 'Item successfully updated',
                content: {
                    ['application/json']: {
                        schema: {
                            $ref: '#/components/schemas/Item',
                        },
                    },
                },
            },
            ['4XX']: {
                description: 'Data validation error. See response for details.',
                content: {
                    ['application/json']: {
                        schema: {
                            $ref: '#/components/schemas/Error',
                        },
                    },
                },
            },
        },
    },
    delete: {
        tags: ['Items'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete an item',
        operationId: 'deleteItem',
        description: 'Delete an item',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Item ID' }],
        responses: {
            ['200']: {
                description: 'The item has been successfully deleted',
                content: {
                    ['application/json']: {
                        schema: {
                            properties: {
                                message: { type: 'string', description: 'Item deleted successfully' },
                            },
                        },
                    },
                },
            },
            ['4XX']: {
                description: 'Data validation error. See response for details.',
                content: {
                    ['application/json']: {
                        schema: {
                            $ref: '#/components/schemas/Error',
                        },
                    },
                },
            },
        },
    },
};

export default itemsId;
