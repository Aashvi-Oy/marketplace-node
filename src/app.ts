import { text, json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';

import routes from './routes';

const app = express();

app.use(cors());
app.use(json());
app.use(text());
app.use(urlencoded({ extended: true }));
app.use('/', routes);

export default app;
