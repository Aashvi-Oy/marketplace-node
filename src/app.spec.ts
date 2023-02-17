import request from 'supertest';

import app from './app';

describe('GET /', () => {
    it('should return "App is running!"', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ health: true });
    });
});
