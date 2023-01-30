import { StatusCode } from '../models';

export class AppError extends Error {
    readonly status: StatusCode = StatusCode.BadRequest;
    constructor(readonly message: string) {
        super(message);
    }
}

export class AppFailure extends Error {
    readonly status: StatusCode = StatusCode.InternalServerError;
    constructor(readonly message: string) {
        super(message);
    }
}

export class ValidationError extends AppError {
    constructor(readonly message: string) {
        super(message);
    }
}

export class Forbidden extends AppError {
    readonly status: StatusCode = StatusCode.Forbidden;
    constructor(readonly message: string) {
        super(message);
    }
}
