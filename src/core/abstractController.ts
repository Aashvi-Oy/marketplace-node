import type { Request, Response } from 'express';
import type { AnyObjectSchema, Asserts } from 'yup';

import { StatusCode } from '../models';

import { AppError, AppFailure, Forbidden, ValidationError } from './errors';
import { validateToken } from './utils';

export type UnknownRequest = Request<unknown, unknown, unknown>;
export type ValidatedRequest<T extends AnyObjectSchema> = UnknownRequest & Asserts<T>;

export abstract class AbstractController<TRequest extends AnyObjectSchema = AnyObjectSchema> {
    protected abstract readonly requestSchema: TRequest | null;

    protected abstract implementation(req: ValidatedRequest<TRequest>, res: Response);

    protected async validateRequest(req: UnknownRequest): Promise<ValidatedRequest<TRequest>> {
        return !this.requestSchema
            ? req
            : await this.requestSchema.validate(req, { abortEarly: false }).catch((e) => {
                  throw new ValidationError(e.errors?.join('\n'));
              });
    }

    public async executeWithAuth(req: UnknownRequest, res: Response): Promise<void> {
        const authorization = req.headers.authorization;
        try {
            req.headers.user = validateToken(authorization) as string;
            return this.execute(req, res);
        } catch (err) {
            const error = new Forbidden(err.message);
            this.respond(res, error.status, error.message);
        }
    }

    public async execute(req: UnknownRequest, res: Response): Promise<void> {
        try {
            const validatedReq = await this.validateRequest(req);
            await this.implementation(validatedReq, res);
        } catch (err) {
            const e = err instanceof AppError ? err : new AppFailure(err);
            this.respond(res, e.status, e.message);
        }
    }

    public respond(res: Response, status: number, dto?: unknown) {
        return dto ? res.status(status).send(typeof dto === 'string' ? { message: dto } : dto) : res.sendStatus(status);
    }

    public success(res: Response, dto?: unknown) {
        return this.respond(res, StatusCode.Success, dto);
    }

    public created(res: Response, dto?: unknown) {
        return this.respond(res, StatusCode.Created, dto);
    }
}
