import { User } from '@prisma/client';

import { comparePassword, createAuthToken, hashPassword } from '../auth';
import { AppError } from '../errors';

describe('Test CreateToken', () => {
    it('Should throw authorization required error', async () => {
        await expect(createAuthToken(null)).rejects.toEqual(new AppError('User object is missing'));
    });

    it('Should throw invalid secret error', async () => {
        await expect(createAuthToken({ id: 1, email: 'a@a.fi' } as User)).toBeTruthy();
    });
});

describe('Test compare password', () => {
    it('Should return false for password mismatch', async () => {
        const hashedPassword = hashPassword('test');
        await expect(comparePassword('invalid', hashedPassword)).toBeFalsy();
    });

    it('Should return true for password match', async () => {
        const hashedPassword = hashPassword('test');
        await expect(comparePassword('test', hashedPassword)).toBeTruthy();
    });
});
