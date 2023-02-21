import request from 'supertest';

import app from '../../../app';
import { createAuthToken, hashPassword } from '../../../core/auth';
import prisma from '../../../db/client';
import { getUserMock } from '../../../db/mocks/mocks';

const usersMock = Array.from({ length: 1 }).map(() => getUserMock());

describe('Test basic auth', () => {
    beforeAll(async () => {
        await Promise.all(
            usersMock.map((user) => prisma.user.create({ data: { ...user, password: hashPassword(user.password) } }))
        );
    });

    // TODO: CHECK WHY THIS IS NOT WORKING ON THE CI
    // afterAll(async () => {
    //     await Promise.all(users.map((u) => prisma.user.delete({ where: { id: u.id } })));
    // });

    it('Trying to log with no email and password', async () => {
        const res = await request(app).get('/user/login');
        expect(res.status).toEqual(401);
    });

    it('Invalid sign in with invalid email and password', async () => {
        const res = await request(app).get('/user/login').auth('doesntexist@ext.com', 'wrong', { type: 'basic' });
        expect(res.status).toEqual(404);
        expect(res.text).toContain('User not found');
    });

    it('Invalid sign in with valid email and wrong password', async () => {
        const res = await request(app).get('/user/login').auth(usersMock[0].email, 'wrong', { type: 'basic' });
        expect(res.status).toEqual(401);
        expect(res.text).toContain('Incorrect password.');
    });

    it('User sign in success', async () => {
        const res = await request(app)
            .get('/user/login')
            .auth(usersMock[0].email, usersMock[0].password, { type: 'basic' });
        expect(res.status).toEqual(200);
        expect(res.body.email).toContain(usersMock[0].email);
        expect(res.body.address).toContain(usersMock[0].address);
    });

    it('User registration throw missing required field error', async () => {
        const res = await request(app).post('/user/register').send({});
        expect(res.status).toEqual(400);
        expect(res.body).toContain('Email is required');
        expect(res.body).toContain('Password is required');
    });

    it('User registration in success', async () => {
        const res = await request(app).post('/user/register').send(getUserMock());
        expect(res.status).toEqual(201);
        expect(res.body.id).toBeTruthy();
    });

    it('Update user name throw unatuthorize error', async () => {
        const res = await request(app).patch('/user').send({ name: 'new name' });
        expect(res.status).toEqual(401);
        expect(res.body.message).toEqual('Invalid/Missing token');
    });

    it('Update user name should be success', async () => {
        const user = await prisma.user.findFirst();
        const token = await createAuthToken(user);
        const res = await request(app)
            .patch('/user')
            .send({ name: 'new name' })
            .set('Authorization', `bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('new name');
    });

    it('Update user password should be success and also hashed', async () => {
        const user = await prisma.user.findFirst();
        const token = await createAuthToken(user);
        const res = await request(app)
            .patch('/user')
            .send({ password: 'newpassword' })
            .set('Authorization', `bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body.password).not.toEqual(user.password);
    });

    it('Update user password should be success and also hashed', async () => {
        const user = await prisma.user.findFirst();
        const token = await createAuthToken(user);
        const res = await request(app)
            .patch('/user')
            .send({ password: 'newpassword' })
            .set('Authorization', `bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body.password).not.toEqual(user.password);
    });

    it('Should be able to delete itself', async () => {
        const user = await prisma.user.findFirst();
        const token = await createAuthToken(user);
        const res = await request(app).delete('/user').set('Authorization', `bearer ${token}`);
        expect(res.status).toEqual(200);
    });
});
