import { Router } from 'express';

import { HealthController } from './get.controller';

export const routes = Router();

// Health
const healthController = (req, res) => new HealthController().execute(req, res);

routes.get('/', healthController);
