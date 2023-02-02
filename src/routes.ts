import { Router } from 'express';

import { HealthController, TestController } from './controllers/health';

const router = Router();
const healthController = (req, res) => new HealthController(req, res).execute();
const testController = (req, res) => new TestController(req, res).execute();

router.get('/', healthController);
router.get('/test', testController);

export default router;
