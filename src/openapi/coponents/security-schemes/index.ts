import { OpenAPIV3 } from 'openapi-types';

import basicAuth from './basicAuth';
import bearerAuth from './bearerAuth';

export const securitySchemes: { [schemeName: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.SecuritySchemeObject } = {
    basicAuth,
    bearerAuth,
};
