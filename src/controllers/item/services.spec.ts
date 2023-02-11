import { AppError } from '../../core/errors';
import { prismaMock } from '../../db/singleton';
import { Item, ItemCreateInput, User } from '../../models';

import { createItem, deleteItem, readAllItems, readOwner, updateItem } from './services';

import ResolvedValue = jest.ResolvedValue;

const userMock: User = {
    id: 1,
    email: 'test@test.com',
    password: 'test',
    name: 'test',
    address: 'test',
    phone: 'test',
};

const itemsMock: ItemCreateInput = {
    name: 'test',
    description: 'test',
    price: 10,
    image: 'test',
    tags: ['test'],
    ratings: [1, 2, 3],
};

describe('Test item services', () => {
    it('should return all the items', async () => {
        // @ts-expect-error -- awaiting fix: https://github.com/prisma/prisma/issues/10203
        prismaMock.item.findMany.mockResolvedValue([{ ...itemsMock, id: 1, ownerId: 21 }] as ResolvedValue<Item[]>);

        await expect(readAllItems()).resolves.toEqual([
            {
                ...itemsMock,
                ownerId: 21,
                id: 1,
            },
        ]);
    });

    it('should create new items with valid data ', async () => {
        // @ts-expect-error -- awaiting fix: https://github.com/prisma/prisma/issues/10203
        prismaMock.user.findUnique.mockResolvedValue({ ...userMock } as ResolvedValue<User>);
        prismaMock.item.create.mockResolvedValue({ ...itemsMock, id: 1, ownerId: 21 } as ResolvedValue<Item>);

        await expect(createItem(21, itemsMock)).resolves.toEqual({
            ...itemsMock,
            ownerId: 21,
            id: 1,
        });
    });

    it('should update throw not allowed error', async () => {
        const error = new AppError('You are not allowed to update this item');
        prismaMock.user.findUnique.mockResolvedValue({ ...userMock } as ResolvedValue<User>);
        prismaMock.item.findUnique.mockResolvedValue({ ...itemsMock } as ResolvedValue<Item>);
        prismaMock.item.update.mockResolvedValue(error as ResolvedValue<AppError>);

        await expect(updateItem(21, 1, { name: 'newName' })).rejects.toEqual(error);
    });

    it('should update a items with valid data ', async () => {
        const dataWithIdAndOwnerId = { ...itemsMock, id: 1, ownerId: 21 };
        prismaMock.item.findUnique.mockResolvedValue(dataWithIdAndOwnerId as ResolvedValue<Item>);
        prismaMock.item.update.mockResolvedValue({ ...dataWithIdAndOwnerId, name: 'newName' } as ResolvedValue<Item>);

        await expect(updateItem(21, 1, { name: 'newName' })).resolves.toEqual({
            ...dataWithIdAndOwnerId,
            name: 'newName',
        });
    });

    it('should throw not found error', async () => {
        const error = new AppError('Item not found');
        prismaMock.item.delete.mockResolvedValue(error as ResolvedValue<AppError>);
        await expect(deleteItem(999999, 3232)).rejects.toEqual(error);
    });

    it('should be able to delete a item', async () => {
        prismaMock.item.findUnique.mockResolvedValue({ ...itemsMock, id: 1, ownerId: 1 } as ResolvedValue<Item>);
        prismaMock.item.delete.mockResolvedValue('You' as ResolvedValue<string>);

        await expect(deleteItem(1, 1)).resolves.toEqual('Item deleted successfully');
    });

    it('should throw user not found error', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null as ResolvedValue<User>);
        const error = new AppError('User not found');

        await expect(readOwner(123)).rejects.toEqual(error);
    });

    it('should throw not allowed to delete error', async () => {
        prismaMock.item.findUnique.mockResolvedValue({ ...itemsMock } as ResolvedValue<Item>);
        const error = new AppError('You are not allowed to delete this item');

        await expect(deleteItem(123, 1)).rejects.toEqual(error);
    });
});
