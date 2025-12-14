import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Routes Integration Tests', () => {
  const app = createApp();

  test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('GET /healthz should return 200 or 503', async () => {
    const response = await request(app).get('/healthz');
    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty('status');
  });

  test('GET /privacy should return 200', async () => {
    const response = await request(app).get('/privacy');
    expect(response.status).toBe(200);
  });

  test('GET /sitemap.xml should return XML', async () => {
    const response = await request(app).get('/sitemap.xml');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/xml');
  });

  test('POST /create should require valid input', async () => {
    const response = await request(app)
      .post('/create')
      .send({ secret: 'test message' });

    // Should redirect on success or return error
    expect([302, 400, 500]).toContain(response.status);
  });
});




