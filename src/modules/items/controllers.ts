import type { Response } from 'express';

import AbstractController from '../../core/abstractController';
import { concatSchemas } from '../../core/utils';
import { Authenticated, Validated } from '../../models';

import { authSchema, headersSchema, paramsSchema, patchItemSchema, postItemSchema } from './schema';
import { createItem, deleteItem, readAllItems, readItem, updateItem } from './services';

const commonSchema = concatSchemas(headersSchema, paramsSchema, authSchema);
const postSchema = concatSchemas(postItemSchema, commonSchema);
const patchSchema = concatSchemas(patchItemSchema, commonSchema);

export class GetAllItemsController extends AbstractController {
    protected readonly requestSchema = null;

    protected async implementation(req, res: Response) {
        const data = await readAllItems();
        return this.success(res, data);
    }
}

export class GetItemController extends AbstractController<typeof paramsSchema> {
    protected readonly requestSchema = paramsSchema;

    protected async implementation(req: Validated<typeof paramsSchema>, res: Response) {
        const data = await readItem(+req.params.id);
        return this.success(res, data);
    }
}

export class PostItemController extends AbstractController<typeof postSchema> {
    protected readonly requestSchema = postSchema;

    protected async implementation(req: Validated<typeof postSchema>, res: Response) {
        const { body, auth } = req;
        const data = await createItem(+auth.id, body);
        return this.created(res, data);
    }
}

export class PatchItemController extends AbstractController<typeof patchSchema> {
    protected readonly requestSchema = patchSchema;

    protected async implementation(req: Validated<typeof patchSchema> & Authenticated, res: Response) {
        const { body, params, auth } = req;
        const data = await updateItem(auth.id, +params.id, body);
        return this.success(res, data);
    }
}

export class DeleteItemController extends AbstractController<typeof commonSchema> {
    protected readonly requestSchema = commonSchema;

    protected async implementation(req: Validated<typeof commonSchema> & Authenticated, res: Response) {
        const { auth } = req;
        const data = await deleteItem(+auth.id, +req.params.id);
        return this.success(res, data);
    }
}
