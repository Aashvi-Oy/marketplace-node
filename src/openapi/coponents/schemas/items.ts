import { OpenAPIV3 } from 'openapi-types';

const BasicItem: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        name: { type: 'string', description: 'Item name' },
        description: { type: 'string', description: 'Item description', default: '' },
        tags: { type: 'array', description: 'Item tag', default: [], items: { type: 'string' } },
        image: { type: 'string', description: 'Item image', default: null, nullable: true },
        ratings: { type: 'array', description: 'Item ratings', default: [], items: { type: 'integer' } },
        price: { type: 'number', description: 'Item price', default: 0 },
    },
};

const Item: OpenAPIV3.SchemaObject = {
    type: 'object',
    required: ['name'],
    properties: {
        id: { type: 'integer', description: 'Item ID' },
        owner: { type: 'integer', description: 'Item owner' },
        ...BasicItem.properties,
    },
};

export { BasicItem, Item };
