import type { Request, Response } from 'express';
import type { AnyObjectSchema, Asserts } from 'yup';

import { StatusCode } from '../models';

import { AppError, AppFailure, ValidationError } from './errors';

export type UnknownRequest = Request<unknown, unknown, unknown>;
export type ValidatedRequest<T extends AnyObjectSchema> = UnknownRequest & Asserts<T>;

abstract class AbstractController<TRequest extends AnyObjectSchema = AnyObjectSchema> {
    private _error: AppError;
    protected abstract readonly requestSchema: TRequest | null;
    protected abstract implementation(req: ValidatedRequest<TRequest>, res: Response);

    protected async validateRequest(req: TRequest): Promise<TRequest | ValidatedRequest<TRequest>> {
        return !this.requestSchema
            ? req
            : this.requestSchema.validate(req, { abortEarly: false }).catch((e) => {
                  throw new ValidationError(e.errors.join(','));
              });
    }

    public async execute(req: TRequest, res: Response): Promise<void> {
        try {
            const validatedRequest = (await this.validateRequest(req)) as ValidatedRequest<TRequest>;
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
