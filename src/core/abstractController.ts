import type { Response } from 'express';
import type { AnyObjectSchema } from 'yup';

import { StatusCode } from '../models';
import { Validated } from '../models/request';

import { AppError, AppFailure, ValidationError } from './errors';

abstract class AbstractController<TRequest extends AnyObjectSchema = AnyObjectSchema> {
    private _error: AppError;
    protected abstract readonly requestSchema: TRequest | null;
    protected abstract implementation(req: Validated<TRequest>, res: Response);

    protected async validateRequest(req: TRequest): Promise<TRequest | Validated<TRequest>> {
        return !this.requestSchema
            ? req
            : this.requestSchema.validate(req, { abortEarly: false }).catch((e) => {
                  throw new ValidationError(e.errors);
              });
    }

    public async execute(req: TRequest, res: Response): Promise<void> {
        try {
            const validatedRequest = (await this.validateRequest(req)) as Validated<TRequest>;
            await this.implementation(validatedRequest, res);
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
