import { validateToken } from './auth';
import { ValidationError } from './errors';
describe('Test ValidateToken', () => {
    it('Should throw authorization required error', () => {
        expect(() => validateToken(null)).toThrow(new ValidationError('headers.authorization is a required field'));
    });

    it('Should throw authorization format error', () => {
        expect(() => validateToken('bearer')).toThrow(
            new ValidationError('headers.authorization is not in correct format: Bearer [token]')
        );
        expect(() => validateToken(' erse')).toThrow(
            new ValidationError('headers.authorization is not in correct format: Bearer [token]')
        );
        expect(() => validateToken('Bearer ')).toThrow(
            new ValidationError('headers.authorization is not in correct format: Bearer [token]')
        );
    });

    it('Should throw authorization format error', () => {
        const res = validateToken('bearer 1123');
        expect(res).toBeTruthy();
    });
});
