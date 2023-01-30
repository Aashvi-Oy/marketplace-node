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
    return 'username';
};
