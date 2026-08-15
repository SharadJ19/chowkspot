import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@/app.js';
import { CONSTANTS } from '@/config/constants.js';

describe('ChowkSpot Backend Integration Tests (Supertest)', () => {
  describe('GET /health', () => {
    it('should return a healthy system status and database connection state', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(CONSTANTS.HTTP_STATUS.OK);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('database');
    });
  });

  describe('Protected Routes Security Guard', () => {
    it('should reject requests to protected bookings routes without a Bearer token', async () => {
      const response = await request(app).get('/api/bookings');

      expect(response.status).toBe(CONSTANTS.HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Authentication token missing');
    });

    it('should reject requests to admin stats routes without an authorization token', async () => {
      const response = await request(app).get('/api/admin/stats');

      expect(response.status).toBe(CONSTANTS.HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Public Worker Discovery Routes', () => {
    it('should successfully query public worker search endpoints without token requirements', async () => {
      const response = await request(app).get('/api/workers/search?category=Electrician');

      // Depending on database state, it should return 200 with data payload structure
      expect(response.status).toBe(CONSTANTS.HTTP_STATUS.OK);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('workers');
      expect(response.body.data).toHaveProperty('pagination');
    });
  });
});
