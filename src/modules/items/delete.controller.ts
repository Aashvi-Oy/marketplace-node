import type { Response } from 'express';
import * as yup from 'yup';

import AbstractController, { ValidatedRequest } from '../../core/abstractController';

import { deleteItem } from './services';

const requestSchema = yup.object().shape({
    headers: yup.object().shape({ user: yup.string().nullable() }),
    params: yup.object().shape({ id: yup.string() }),
});

export class DeleteItemController extends AbstractController<typeof requestSchema> {
    protected readonly requestSchema = requestSchema;

    protected async implementation(req: ValidatedRequest<typeof requestSchema>, res: Response) {
        const { headers } = req;
        const data = await deleteItem(+headers.user, +req.params.id);
        return this.success(res, data);
    }
}
