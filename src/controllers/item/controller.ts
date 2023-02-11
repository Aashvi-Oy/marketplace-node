import type { Response } from 'express';
import * as yup from 'yup';

import AbstractController, { ValidatedRequest } from '../../core/abstractController';

import { readAllItems, readItem, createItem, updateItem, deleteItem } from './services';

const bodySchema = yup.object().shape({
    body: yup
        .object()
        .shape({
            name: yup.string().required('Item name is required'),
            description: yup.string().default(''),
            price: yup.number().default(0),
            image: yup.string().nullable(),
            tags: yup.array().of(yup.string()).default([]),
            ratings: yup.array().of(yup.number()).default([]),
        })
        .noUnknown()
        .required(),
});

const defaultSchema = yup.object().shape({
    headers: yup.object().shape({ user: yup.string().nullable() }),
    params: yup.object().shape({ id: yup.string() }),
});

const requestSchema = defaultSchema.concat(bodySchema);

export class GetAllItemsController extends AbstractController {
    protected readonly requestSchema = null;

    protected async implementation(req, res: Response) {
        const data = await readAllItems();
        return this.success(res, data);
    }
}

export class GetItemController extends AbstractController {
    protected readonly requestSchema = null;

    protected async implementation(req, res: Response) {
        const data = await readItem(+req.params.id);
        return this.success(res, data);
    }
}

export class PostItemController extends AbstractController<typeof requestSchema> {
    protected readonly requestSchema = requestSchema;

    protected async implementation(req: ValidatedRequest<typeof requestSchema>, res: Response) {
        const { body, headers } = req;
        const data = await createItem(+headers.user, body);
        return this.created(res, data);
    }
}

export class PatchItemController extends AbstractController<typeof requestSchema> {
    protected readonly requestSchema = requestSchema;

    protected async implementation(req: ValidatedRequest<typeof requestSchema>, res: Response) {
        const { body, params, headers } = req;
        const data = await updateItem(+headers.user, +params.id, body);
        return this.success(res, data);
    }
}

export class DeleteItemController extends AbstractController<typeof defaultSchema> {
    protected readonly requestSchema = defaultSchema;

    protected async implementation(req: ValidatedRequest<typeof defaultSchema>, res: Response) {
        const { headers } = req;
        const data = await deleteItem(+headers.user, +req.params.id);
        return this.success(res, data);
    }
}
