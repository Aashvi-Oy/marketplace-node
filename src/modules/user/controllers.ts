import type { Response, Request } from 'express';

import AbstractController from '../../core/abstractController';
import { createAuthToken } from '../../core/auth';
import { Authenticated, LoggedInUser } from '../../models/';

import { createUser, deleteUser, readUser, updateUser } from './services';

export class GetUserController extends AbstractController {
    protected async implementation(req: LoggedInUser, res: Response) {
        const data = await readUser(req.user.email);
        const token = await createAuthToken(data);
        return this.success(res, { ...data, token });
    }
}

export class PostUserController extends AbstractController {
    protected async implementation(req: Request, res: Response) {
        const { body } = req;
        const data = await createUser(body);
        return this.created(res, data);
    }
}

export class PatchUserController extends AbstractController {
    protected async implementation(req: Authenticated, res: Response) {
        const { body, auth } = req;
        const data = await updateUser(auth.id, body);
        return this.success(res, data);
    }
}

export class DeleteUserController extends AbstractController {
    protected async implementation(req: Authenticated, res: Response) {
        const { auth } = req;
        const data = await deleteUser(+auth.id);
        return this.success(res, data);
    }
}
