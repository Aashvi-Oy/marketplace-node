import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express, { Request } from 'express';
import { initialize } from 'express-openapi';
import * as OpenApiValidator from 'express-openapi-validator';
import { Path } from 'express-unless';
import swaggerUi from 'swagger-ui-express';

import { authenticate, basicAuthentication } from './core/auth';
import * as health from './modules/health/operations';
import * as items from './modules/items/operations';
import * as user from './modules/user/operations';
import openapiSpec from './openapi';

const unprotectedUrls: Path[] = [
    { url: '/docs', methods: ['GET'] },
    { url: '/health', methods: ['GET'] },
    { url: '/user/login', methods: ['GET'] },
    { url: '/user/register', methods: ['POST'] },
    { url: new RegExp('/items/*'), methods: ['GET'] },
];

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            spec: openapiSpec,
        },
    })
);
app.use(authenticate.unless({ path: unprotectedUrls }));

app.use(
    OpenApiValidator.middleware({
        apiSpec: openapiSpec,
        validateRequests: {
            // Remove unknown properties from request body
            removeAdditional: 'all',
        },
        validateResponses: true,
    })
);
app.use((err, req, res, _) => {
    // format error
    res.status(err.status).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
    });
});

initialize({
    app,
    apiDoc: openapiSpec,
    operations: {
        ...health.operations,
        ...user.operations,
        ...items.operations,
    },
    securityHandlers: {
        basicAuth: async (req: Request) => basicAuthentication(req),
        bearerAuth: () => true, // Is handled by authenticate middleware
    },
});

export default app;
