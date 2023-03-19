import { OpenAPIV3 } from 'openapi-types';

const basicAuth: OpenAPIV3.SecuritySchemeObject = {
    type: 'http',
    scheme: 'basic',
};

export default basicAuth;
