import { text, json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';

import routes from './routes';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(json());
app.use(text());
app.use(urlencoded({ extended: true }));
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
