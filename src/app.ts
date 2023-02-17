import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { Path } from 'express-unless';

import { authenticate } from './core/auth';
import { StatusCode } from './models';
import * as health from './modules/health/routes';
import * as items from './modules/items/routes';
import * as user from './modules/user/routes';

const unprotectedUrls: Path[] = [
    { url: '/health', methods: ['GET'] },
    { url: '/user/login', methods: ['GET'] },
    { url: '/user/register', methods: ['POST'] },
    { url: new RegExp('/items/*'), methods: ['GET'] },
];

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(authenticate.unless({ path: unprotectedUrls }));

// Error handling for invalid token.
app.use((err, req, res, next) => {
    // Checking of next is just to make linter happy
    // and not to throw error for unused variable.
    if (err.name === 'UnauthorizedError' && !!next) {
        res.status(StatusCode.Unauthorized).send({ message: 'Invalid/Missing token' });
    }
});

app.use('/health', health.routes);
app.use('/items', items.routes);
app.use('/user', user.routes);

export default app;
