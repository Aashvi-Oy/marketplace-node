import type { Response } from 'express';
import * as yup from 'yup';

import AbstractController, { ValidatedRequest } from '../../core/abstractController';

import { readAllItems, readItem } from './services';

const requestSchema = yup.object().shape({
    params: yup.object().shape({ id: yup.string() }),
});

export class GetAllItemsController extends AbstractController {
    protected readonly requestSchema = null;

    protected async implementation(req, res: Response) {
        const data = await readAllItems();
        return this.success(res, data);
    }
}

export class GetItemController extends AbstractController<typeof requestSchema> {
    protected readonly requestSchema = requestSchema;

    protected async implementation(req: ValidatedRequest<typeof requestSchema>, res: Response) {
        const data = await readItem(+req.params.id);
        return this.success(res, data);
    }
}
