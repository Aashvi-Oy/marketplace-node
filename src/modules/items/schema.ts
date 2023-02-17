import * as yup from 'yup';

const itemRequiredSchema = yup
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
    .required();

const itemOptionalSchema = yup
    .object()
    .shape({
        name: yup.string(),
        description: yup.string(),
        price: yup.number(),
        image: yup.string().nullable(),
        tags: yup.array().of(yup.string()),
        ratings: yup.array().of(yup.number()),
    })
    .noUnknown()
    .required();

export const authSchema = yup.object().shape({ auth: yup.object().shape({ id: yup.number() }) });

export const postItemSchema = yup.object().shape({ body: itemRequiredSchema });

export const patchItemSchema = yup.object().shape({ body: itemOptionalSchema });

export const headersSchema = yup.object().shape({ headers: yup.object().shape({ user: yup.string() }) });

export const paramsSchema = yup.object().shape({ params: yup.object().shape({ id: yup.string() }) });
