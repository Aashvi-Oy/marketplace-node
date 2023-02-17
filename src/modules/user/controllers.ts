import type { Response } from 'express';

import AbstractController from '../../core/abstractController';
import { createAuthToken } from '../../core/auth';
import { Authenticated, LoggedInUser, Validated } from '../../models/';

import { patchUserSchema, postUserSchema } from './schema';
import { createUser, deleteUser, readUser, updateUser } from './services';

export class GetUserController extends AbstractController {
    protected readonly requestSchema = null;

    protected async implementation(req: LoggedInUser, res: Response) {
        const data = await readUser(req.user.email);
        const token = await createAuthToken(data);
        return this.success(res, { ...data, token });
    }
}

export class PostUserController extends AbstractController<typeof postUserSchema> {
    protected readonly requestSchema = postUserSchema;

    protected async implementation(req: Validated<typeof postUserSchema>, res: Response) {
        const { body } = req;
        const data = await createUser(body);
        return this.created(res, data);
    }
}

export class PatchUserController extends AbstractController<typeof patchUserSchema> {
    protected readonly requestSchema = patchUserSchema;

    protected async implementation(req: Validated<typeof patchUserSchema> & Authenticated, res: Response) {
        const { body, auth } = req;
        const data = await updateUser(auth.id, body);
        return this.success(res, data);
    }
}

export class DeleteUserController extends AbstractController {
    protected readonly requestSchema = null;

    protected async implementation(req: Authenticated, res: Response) {
        const { auth } = req;
        const data = await deleteUser(+auth.id);
        return this.success(res, data);
    }
}
