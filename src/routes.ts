import { Router } from 'express';

import { HealthController } from './controllers/health';

const router = Router();
const healthController = (req, res) => new HealthController(req, res).execute();

router.get('/', healthController);

export default router;
