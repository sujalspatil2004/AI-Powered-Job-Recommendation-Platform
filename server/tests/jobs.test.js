const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { Job } = require('../models/job');

jest.spyOn(mongoose, 'connect').mockResolvedValue();
jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { _id: 'mockUserId', email: 'test@example.com' };
  next();
});

describe('Job Matching', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return jobs for a valid user', async () => {
    // Mock Job.find().sort() chain
    Job.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { _id: '1', title: 'Software Engineer', company: 'TestCorp', location: 'Remote' }
      ])
    });

    const res = await request(app)
      .get('/api/jobs')
      .set('Authorization', 'Bearer mocktoken');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('title', 'Software Engineer');
  });

  it('should return an empty array if no jobs exist', async () => {
    Job.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([])
    });

    const res = await request(app)
      .get('/api/jobs')
      .set('Authorization', 'Bearer mocktoken');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
