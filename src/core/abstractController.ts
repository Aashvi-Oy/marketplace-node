import type { Request, Response } from 'express';
import type { AnyObjectSchema, Asserts } from 'yup';

import { StatusCode } from '../models';

import { AppError, AppFailure, Forbidden, ValidationError } from './errors';
import { validateToken } from './utils';

export type UnknownRequest = Request<unknown, unknown, unknown>;
export type ValidatedRequest<T extends AnyObjectSchema> = UnknownRequest & Asserts<T>;

abstract class AbstractController<TRequest extends AnyObjectSchema = AnyObjectSchema> {
    protected abstract readonly requestSchema: TRequest | null;
    private res: Response;
    private error: AppError;
    private req: ValidatedRequest<TRequest>;

    constructor(req: ValidatedRequest<TRequest>, res: Response) {
        this.req = req;
        this.res = res;
    }

    protected abstract implementation();

    protected async validateRequest(): Promise<void> {
        if (this.requestSchema) {
            await this.requestSchema.validate(this.req, { abortEarly: false }).catch((e) => {
                throw new ValidationError(e.errors.join(','));
            });
        }
    }

    public authenticate(): AbstractController {
        const authorization = this.req.headers.authorization;
        try {
            this.req.headers.user = validateToken(authorization) as string;
        } catch (err) {
            this.error = new Forbidden(err.message);
        }
        return this;
    }

    public async execute(): Promise<void> {
        if (!this.error) {
            try {
                await this.validateRequest();
                await this.implementation();
            } catch (err) {
                const e = err instanceof AppError ? err : new AppFailure(err);
                this.respond(e.status, e.message);
            }
        } else {
            this.respond(this.error.status, this.error.message);
        }
    }

    public respond(status: number, dto?: unknown) {
        return dto
            ? this.res.status(status).send(typeof dto === 'string' ? { message: dto } : dto)
            : this.res.sendStatus(status);
    }

    public success(dto?: unknown) {
        return this.respond(StatusCode.Success, dto);
    }

    public created(dto?: unknown) {
        return this.respond(StatusCode.Created, dto);
    }
}

export default AbstractController;
