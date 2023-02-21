import type { Response, Request } from 'express';

import { StatusCode } from '../models';

import { AppError, AppFailure } from './errors';

abstract class AbstractController {
    private _error: AppError;
    protected abstract implementation(req: Request, res: Response);

    public async execute(req: Request, res: Response): Promise<void> {
        try {
            await this.implementation(req, res);
        } catch (err) {
            const e = err instanceof AppError ? err : new AppFailure(err.message);
            this.respond(res, e.status, e.message);
        }
    }

    public respond(res, status: number, dto?: unknown) {
        return dto ? res.status(status).send(typeof dto === 'string' ? { message: dto } : dto) : res.sendStatus(status);
    }

    public success(res, dto?: unknown) {
        return this.respond(res, StatusCode.Success, dto);
    }

    public created(res, dto?: unknown) {
        return this.respond(res, StatusCode.Created, dto);
    }
}

export default AbstractController;
