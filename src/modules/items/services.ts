import { Item, User } from '@prisma/client';

import { AppError, NotFoundError } from '../../core/errors';
import prisma from '../../db/client';

const readAllItems = async (): Promise<Item[]> => prisma.item.findMany();

const readItem = async (id: number): Promise<Item> => {
    const item = await prisma.item.findUnique({
        where: { id: Number(id) },
    });
    if (!item) {
        throw new NotFoundError('Item not found');
    }
    return item;
};

const readOwner = async (id: number): Promise<User> => {
    const owner = await prisma.user.findUnique({
        where: { id: Number(id) },
    });
    if (!owner) {
        throw new NotFoundError('User not found');
    }
    return owner;
};

const createItem = async (ownerId: number, item: Omit<Item, 'id' | 'ownerId'>): Promise<Item> => {
    const owner = await readOwner(ownerId);
    return prisma.item.create({ data: { ...item, ownerId: Number(owner.id) } });
};

const updateItem = async (ownerId: number, id: number, item: Partial<Item>): Promise<Item> => {
    const origItem = await readItem(id);
    if (origItem.ownerId !== ownerId) {
        throw new AppError('You are not allowed to update this item');
    }
    return prisma.item.update({ where: { id: Number(id) }, data: item });
};

const deleteItem = async (ownerId: number, id: number): Promise<string> => {
    const origItem = await readItem(id);
    if (!origItem || origItem.ownerId !== ownerId) {
        throw new AppError('You are not allowed to delete this item');
    }

    return prisma.item.delete({ where: { id: Number(id) } }).then(() => 'Item deleted successfully');
};

export { readAllItems, readOwner, readItem, createItem, updateItem, deleteItem };
