import { HealthController } from './controllers';

// Health
const healthController = (req, res) => new HealthController().execute(req, res);

export const operations = { getHealth: healthController };
