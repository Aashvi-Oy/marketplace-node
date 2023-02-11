import type { Response } from 'express';
import * as yup from 'yup';

import AbstractController, { ValidatedRequest } from '../../core/abstractController';

import { createItem } from './services';

const requestSchema = yup.object().shape({
    headers: yup.object().shape({ user: yup.string().nullable() }),
    params: yup.object().shape({ id: yup.string() }),
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

export class PostItemController extends AbstractController<typeof requestSchema> {
    protected readonly requestSchema = requestSchema;

    protected async implementation(req: ValidatedRequest<typeof requestSchema>, res: Response) {
        const { body, headers } = req;
        const data = await createItem(+headers.user, body);
        return this.created(res, data);
    }
}
