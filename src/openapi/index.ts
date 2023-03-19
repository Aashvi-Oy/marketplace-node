import { OpenAPIV3 } from 'openapi-types';

import { version, name, description, author, author_email, license } from '../../package.json';

import { schemas } from './coponents/schemas';
import { securitySchemes } from './coponents/security-schemes';
import { paths } from './paths';

const tags: OpenAPIV3.TagObject[] = [
    { name: 'Health', description: 'Health check' },
    { name: 'Items', description: 'Items management' },
    { name: 'User', description: 'User management' },
];

const info: OpenAPIV3.InfoObject = {
    version,
    title: name,
    description,
    contact: { name: author, email: author_email },
    license: { name: license },
};

const servers: OpenAPIV3.ServerObject[] = [{ url: 'http://localhost:8080', description: 'Local development' }];

const openapiSpec: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info,
    servers,
    tags,
    paths,
    components: {
        securitySchemes,
        schemas,
    },
};

export default openapiSpec;
