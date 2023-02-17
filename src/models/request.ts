import { User } from '@prisma/client';
import { Request } from 'express';
import { AnyObjectSchema, Asserts } from 'yup';

export type UnknownRequest = Request<unknown, unknown, unknown>;

export type Validated<T extends AnyObjectSchema> = UnknownRequest & Asserts<T>;

export interface LoggedInUser extends Request {
    user: User;
}

export interface Authenticated extends Request {
    auth: { id: number };
}
