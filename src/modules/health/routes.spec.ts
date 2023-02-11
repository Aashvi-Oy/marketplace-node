import request from 'supertest';

import app from '../../app';

describe('Routes test', () => {
    it('GET / => health', async () =>
        request(app)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({ health: true });
            }));
});
