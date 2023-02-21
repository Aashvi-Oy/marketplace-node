import type { Response, Request } from 'express';

import AbstractController from '../../core/abstractController';
import { Authenticated } from '../../models';

import { createItem, deleteItem, readAllItems, readItem, updateItem } from './services';

export class GetAllItemsController extends AbstractController {
    protected async implementation(req, res: Response) {
        const data = await readAllItems();
        return this.success(res, data);
    }
}

export class GetItemController extends AbstractController {
    protected async implementation(req: Request, res: Response) {
        const data = await readItem(+req.params.id);
        return this.success(res, data);
    }
}

export class PostItemController extends AbstractController {
    protected async implementation(req, res: Response) {
        const { body, auth } = req;
        const data = await createItem(+auth.id, body);
        return this.created(res, data);
    }
}

export class PatchItemController extends AbstractController {
    protected async implementation(req: Authenticated, res: Response) {
        const { body, params, auth } = req;
        const data = await updateItem(auth.id, +params.id, body);
        return this.success(res, data);
    }
}

export class DeleteItemController extends AbstractController {
    protected async implementation(req: Authenticated, res: Response) {
        const { auth } = req;
        const data = await deleteItem(+auth.id, +req.params.id);
        return this.success(res, data);
    }
}
