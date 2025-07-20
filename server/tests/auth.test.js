const request = require('supertest');
const app = require('../index');

describe('Auth Routes', () => {
  it('should return 400 for missing credentials', async () => {
    const res = await request(app).post('/api/auth').send({});
    expect(res.statusCode).toBe(400);
  });
  // Add more tests for login, register, etc.
});
