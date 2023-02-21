import request from 'supertest';

import app from '../../../app';
import { createAuthToken, hashPassword } from '../../../core/auth';
import prisma from '../../../db/client';
import { getItemMock, getUserMock } from '../../../db/mocks/mocks';

const usersMock = Array.from({ length: 6 }).map(() => getUserMock());
const itemsMock = Array.from({ length: 10 }).map(() => getItemMock());

describe('Routes test', () => {
    let users = [];
    let items = [];
    beforeAll(async () => {
        users = await Promise.all(
            usersMock.map((user) => prisma.user.create({ data: { ...user, password: hashPassword(user.password) } }))
        );
        items = await Promise.all(
            itemsMock.map((item) => prisma.item.create({ data: { ...item, ownerId: users[0].id } }))
        );
    });

    describe('Item GET routes', () => {
        it('GET /items => All items', async () => {
            const res = await request(app).get('/items');
            expect(res).toBeDefined();
            expect(res.status).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('GET /items/1 => Get single item', async () => {
            const res = await request(app).get(`/items/${items[0].id}`);
            expect(res).toBeDefined();
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(items[0]);
        });

        it('GET /items/1 => Not found error', async () => {
            const res = await request(app).get('/items/1999');
            expect(res).toBeDefined();
            expect(res.status).toEqual(404);
            expect(res.body.message).toContain('Item not found');
        });
    });

    describe('Item Patch routes', () => {
        let bearerToken = null;
        beforeAll(async () => {
            const token = await createAuthToken(users[0]);
            bearerToken = 'bearer ' + token;
        });

        it('Patch /items => unknown key should not change the item', async () => {
            const item = items.find((i) => i.ownerId === users[0].id);
            const res = await request(app)
                .patch('/items/' + item.id)
                .set('Authorization', bearerToken)
                .send({ randomKey: 'New name of item 1' });
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(item);
        });

        it('Patch /items => successful name update', async () => {
            const item = items.find((i) => i.ownerId === users[0].id);
            const res = await request(app)
                .patch('/items/' + item.id)
                .set('Authorization', bearerToken)
                .send({ name: 'New name of item 1' });
            expect(res.status).toEqual(200);
            expect(res.body.name).toContain('New name of item 1');
        });

        it('Patch /items => Item not found error', async () => {
            const res = await request(app)
                .patch('/items/13423')
                .set('Authorization', bearerToken)
                .send({ name: 'New name of item 1' });
            expect(res.status).toEqual(404);
            expect(res.body.message).toContain('Item not found');
        });

        describe('Delete Item routes', () => {
            let bearerToken = null;
            beforeAll(async () => {
                const token = await createAuthToken(users[0]);
                bearerToken = 'bearer ' + token;
            });
            it('Delete /items => Throw not found for trying to delete non existing item', async () => {
                const res = await request(app).delete('/items/234234234').set('Authorization', bearerToken);
                expect(res.status).toEqual(404);
                expect(res.body.message).toEqual('Item not found');
            });

            it('Delete /items => Item delete success', async () => {
                const item = items.find((i) => i.ownerId === users[0].id);
                const res = await request(app)
                    .delete('/items/' + item.id)
                    .set('Authorization', bearerToken);
                expect(res.status).toEqual(200);
                expect(res.body.message).toEqual('Item deleted successfully');
            });
        });

        describe('Item POST routes', () => {
            let bearerToken = null;
            beforeAll(async () => {
                const token = await createAuthToken(users[0]);
                bearerToken = 'bearer ' + token;
            });
            it('Post /items => missing required field name', async () => {
                const res = await request(app).post('/items').set('Authorization', bearerToken).send({});
                expect(res.status).toEqual(400);
                expect(res.body).toContain('Item name is required');
            });

            it('Post /items => Error unauthorize error', async () => {
                const res = await request(app).post('/items/', getItemMock());
                expect(res.status).toEqual(401);
            });

            it('Post /items => post valid body', async () => {
                const res = await request(app).post('/items').set('Authorization', bearerToken).send(getItemMock());
                expect(res.status).toEqual(201);
            });
        });
    });
});
