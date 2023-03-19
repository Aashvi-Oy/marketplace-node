import { OpenAPIV3 } from 'openapi-types';

const Error: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        message: { type: 'string', description: 'Error message', default: '' },
    },
};

export { Error };
