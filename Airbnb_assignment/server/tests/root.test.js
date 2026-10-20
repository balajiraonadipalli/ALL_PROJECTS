import request from 'supertest';
import app from '../src/app.js';

describe('Root endpoint', () => {
  it('GET / returns service name', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body?.name).toBe('airbnb-clone-api');
  });
});


