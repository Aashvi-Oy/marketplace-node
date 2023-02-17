import * as yup from 'yup';

const userRequiredSchema = yup
    .object({
        name: yup.string().default(''),
        address: yup.string().default(''),
        phone: yup.string().default(''),
        email: yup.string().email().required('Email is required'),
        password: yup
            .string()
            .required('Password is required')
            .min(6, 'Password is too short - should be 6 chars minimum.'),
    })
    .noUnknown()
    .required();

const userOptionalSchema = yup
    .object({
        name: yup.string(),
        address: yup.string(),
        phone: yup.string(),
        password: yup.string().min(6, 'Password is too short - should be 6 chars minimum.'),
    })
    .noUnknown()
    .required();

export const postUserSchema = yup.object({ body: userRequiredSchema });

export const patchUserSchema = yup.object({ body: userOptionalSchema });
