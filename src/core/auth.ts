import { Response, Request } from 'express';

import { StatusCode } from '../models';

import { AppError, ValidationError } from './errors';
export const validateToken = (authorization: string): string | AppError => {
    if (!authorization) {
        throw new ValidationError('headers.authorization is a required field');
    }

    const [scheme, token] = authorization.split(' ');
    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
        throw new ValidationError('headers.authorization is not in correct format: Bearer [token]');
    }
    // const jwks: JWK[] = JSON.parse(process.env.JWKS);
    // const { header } = decode(token, { complete: true });
    //
    // const pem = jwkToPem(jwks.find((jwk) => jwk['kid'] === header.kid));
    // const verified = verify(token, pem, { algorithms: ['RS256'] });

    // return Promise.resolve(verified['username']);
    return '1';
};

export const authenticate = (req: Request, res: Response, next: () => void): void => {
    try {
        req.headers['user'] = validateToken(req.headers.authorization) as string;
        next();
    } catch (e) {
        res.status(StatusCode.Forbidden).send({ message: e.message });
    }
};
