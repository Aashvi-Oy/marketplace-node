import type { Response } from 'express';
import * as yup from 'yup';

import AbstractController, { ValidatedRequest } from '../../core/abstractController';

import { updateItem } from './services';

const requestSchema = yup.object().shape({
    headers: yup.object().shape({ user: yup.string().nullable() }),
    params: yup.object().shape({ id: yup.string() }),
    body: yup
        .object()
        .shape({
            name: yup.string(),
            description: yup.string(),
            price: yup.number(),
            image: yup.string(),
            tags: yup.array().of(yup.string()),
            ratings: yup.array().of(yup.number()),
        })
        .noUnknown()
        .required(),
});

export class PatchItemController extends AbstractController<typeof requestSchema> {
    protected readonly requestSchema = requestSchema;

    protected async implementation(req: ValidatedRequest<typeof requestSchema>, res: Response) {
        const { body, params, headers } = req;
        const data = await updateItem(+headers.user, +params.id, body);
        return this.success(res, data);
    }
}
