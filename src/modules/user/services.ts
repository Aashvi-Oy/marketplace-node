import { User } from '@prisma/client';

import { hashPassword } from '../../core/auth';
import { AppError, NotFoundError } from '../../core/errors';
import prisma from '../../db/client';

const readUser = async (identifier: string): Promise<User> => {
    const user = await prisma.user.findFirst({
        where: isNaN(+identifier) ? { email: identifier } : { id: Number(identifier) },
    });
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const password = hashPassword(user.password);
    const existingUser = await prisma.user.findFirst({
        where: { email: user.email },
    });
    if (existingUser) {
        throw new AppError('User already exists');
    }
    return prisma.user.create({ data: { ...user, password } });
};

const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
    if (user.password) {
        user.password = hashPassword(user.password);
    }
    return prisma.user.update({ where: { id: Number(id) }, data: user });
};

const deleteUser = async (id: number): Promise<string> =>
    prisma.user.delete({ where: { id: Number(id) } }).then(() => 'User deleted successfully');

export { readUser, createUser, updateUser, deleteUser };
