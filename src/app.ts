import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';

import * as health from './modules/health/routes';
import * as items from './modules/items/routes';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/', health.routes);
app.use('/items', items.routes);

export default app;
