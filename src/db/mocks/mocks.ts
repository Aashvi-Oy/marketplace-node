import { faker } from '@faker-js/faker';
import { Item, User } from '@prisma/client';

export const getUserMock = (): Omit<User, 'id'> => ({
    email: faker.internet.email(),
    password: faker.internet.password(10, true),
    name: faker.name.firstName(),
    address: faker.address.streetAddress(),
    phone: faker.phone.number(),
});

export const getItemMock = (): Omit<Item, 'id' | 'ownerId'> => ({
    name: faker.name.lastName(),
    description: faker.lorem.lines(),
    price: faker.datatype.number({ min: 100, max: 1000 }),
    image: faker.image.imageUrl(),
    tags: Array.from({ length: 3 }, () => faker.name.firstName()),
    ratings: [faker.datatype.number({ min: 0, max: 5 })],
});
