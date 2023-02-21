import request from 'supertest';

import app from '../../../app';

describe('Routes test', () => {
    it('GET /health => health', async () =>
        request(app)
            .get('/health')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({ health: true });
            }));

    it('GET /random => Missing token error', async () =>
        request(app)
            .get('/random')
            .expect('Content-Type', /json/)
            .expect(401)
            .catch((err) => {
                expect(err.error).toEqual({ message: 'Invalid/Missing token' });
            }));
});
