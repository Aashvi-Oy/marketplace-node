import { User } from '@prisma/client';
import { Request } from 'express';

export interface LoggedInUser extends Request {
    user: User;
}

export interface Authenticated extends Request {
    auth: { id: number };
}
