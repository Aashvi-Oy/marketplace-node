import request from 'supertest';

import app from './app';
import prisma from './db/client';
import { Item, User } from './models';

const itemMock: Item = {
    id: 1,
    ownerId: 1,
    name: 'test',
    description: 'test',
    price: 10,
    image: 'test',
    tags: ['test'],
    ratings: [1, 2, 3],
};

const userMock: User = {
    id: 1,
    email: 'test@test.com',
    password: 'test',
    name: 'test',
    address: 'test',
    phone: 'test',
};

describe('Routes test', () => {
    beforeAll(async () => {
        await prisma.user.createMany({
            data: [{ ...userMock }],
        });
        await prisma.item.createMany({
            data: [{ ...itemMock }, { ...itemMock, id: 2 }, { ...itemMock, id: 3 }],
        });
    });

    afterAll(async () => {
        const deleteUser = prisma.user.deleteMany();
        const deleteItem = prisma.item.deleteMany();
        await prisma.$transaction([deleteItem, deleteUser]);
        await prisma.$disconnect();
    });

    it('GET / => health', async () =>
        request(app)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({ health: true });
            }));

    describe('Item GET routes', () => {
        it('GET /items => All items', async () => {
            const res = await request(app).get('/items');
            expect(res).toBeDefined();
            expect(res.status).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('GET /items/1 => Get single item', async () => {
            const res = await request(app).get('/items/1');
            expect(res).toBeDefined();
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(itemMock);
        });

        it('GET /items/1 => Not found error', async () => {
            const res = await request(app).get('/items/1999');
            expect(res).toBeDefined();
            expect(res.status).toEqual(404);
            expect(res.text).toContain('Item not found');
        });
    });

    describe('Item Patch routes', () => {
        it('Patch /items => missing required field name', async () => {
            const res = await request(app)
                .patch('/items/1')
                .set('Authorization', 'bearer 123')
                .send({ name: 'New name of item 1' });
            expect(res.status).toEqual(200);
            expect(res.body.name).toContain('New name of item 1');
        });

        it('Patch /items => Item not found error', async () => {
            const res = await request(app)
                .patch('/items/13423')
                .set('Authorization', 'bearer 123')
                .send({ name: 'New name of item 1' });
            expect(res.status).toEqual(404);
            expect(res.text).toContain('Item not found');
        });
    });

    describe('Delete Item routes', () => {
        it('Delete /items => Item delete success', async () => {
            const res = await request(app).delete('/items/1').set('Authorization', 'bearer 123');
            expect(res.status).toEqual(200);
            expect(res.text).toContain('Item deleted successfully');
        });

        it('Delete /items => Item not found error', async () => {
            const res = await request(app).delete('/items/300').set('Authorization', 'bearer 123');
            expect(res.status).toEqual(404);
            expect(res.text).toContain('Item not found');
        });
    });

    describe('Item POST routes', () => {
        it('Post /items => missing required field name', async () => {
            const res = await request(app).post('/items').set('Authorization', 'bearer 123').send({});
            expect(res.status).toEqual(400);
            expect(res.text).toContain('Item name is required');
        });

        it('Post /items => Error unauthorize error', async () => {
            const res = await request(app).post('/items/', itemMock);
            expect(res.status).toEqual(403);
        });

        it('Post /items => post valid body', async () => {
            const res = await request(app).post('/items').set('Authorization', 'bearer 123').send(itemMock);
            expect(res.status).toEqual(201);
        });
    });
});
