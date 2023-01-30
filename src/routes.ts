import { Router } from 'express';

import { HealthController } from './controllers/health';

const router = Router();
const healthController = new HealthController();

router.get('/', (req, res) => healthController.execute(req, res));

export default router;
