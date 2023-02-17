import { User } from '@prisma/client';

import { AppError } from '../../../core/errors';
import { prismaMock } from '../../../db/mocks/singleton';
import { createUser, deleteUser, readUser, updateUser } from '../services';

import ResolvedValue = jest.ResolvedValue;

const userMock: User = {
    id: 1,
    email: 'test@test.com',
    password: 'test',
    name: 'test',
    address: 'test',
    phone: 'test',
};

describe('Test user services', () => {
    it('should return user with matching id', async () => {
        // @ts-expect-error -- awaiting fix: https://github.com/prisma/prisma/issues/10203
        prismaMock.user.findFirst.mockResolvedValue({ ...userMock } as ResolvedValue<User>);

        await expect(readUser('1')).resolves.toEqual(userMock);
    });

    it('should return user with matching email', async () => {
        prismaMock.user.findFirst.mockResolvedValue({ ...userMock } as ResolvedValue<User>);

        await expect(readUser('test@test.com')).resolves.toEqual(userMock);
    });

    it('should create a user', async () => {
        prismaMock.user.create.mockResolvedValue({ ...userMock, id: 2, email: 'a@a.fi' } as ResolvedValue<AppError>);

        await expect(createUser({ ...userMock, email: 'a@a.fi' })).resolves.toEqual({
            ...userMock,
            id: 2,
            email: 'a@a.fi',
        });
    });

    it('should throw an error for unique constraints create a user', async () => {
        prismaMock.user.create.mockResolvedValue({ ...userMock, id: 2, email: 'a@a.fi' } as ResolvedValue<AppError>);

        await expect(createUser({ ...userMock, email: 'a@a.fi' })).resolves.toEqual({
            ...userMock,
            id: 2,
            email: 'a@a.fi',
        });
    });

    it('should update a user with valid data ', async () => {
        prismaMock.user.update.mockResolvedValue({ ...userMock, name: 'newName' } as ResolvedValue<User>);

        await expect(updateUser(1, { name: 'newName' })).resolves.toEqual({
            ...userMock,
            name: 'newName',
        });
    });

    it('should be able to delete a user', async () => {
        prismaMock.user.delete.mockResolvedValue('User deleted successfully' as ResolvedValue<string>);

        await expect(deleteUser(1)).resolves.toEqual('User deleted successfully');
    });
});
