import type { Response } from 'express';

import AbstractController from '../core/abstractController';

export class HealthController extends AbstractController {
    protected readonly requestSchema = null;
    protected async implementation(req, res: Response) {
        return this.success(res, { health: true });
    }
}
