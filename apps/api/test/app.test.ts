import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';

describe('Fastify Server Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('returns status 200 with ok message and uptime', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('POST /api/workflows validation', () => {
    it('returns 400 Bad Request if workflow contains a cycle', async () => {
      const cyclicWorkflow = {
        name: 'Cyclic Workflow',
        nodes: [{ id: 'A' }, { id: 'B' }],
        edges: [
          { source: 'A', target: 'B' },
          { source: 'B', target: 'A' },
        ],
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/workflows',
        payload: cyclicWorkflow,
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toContain('cycle');
    });
  });
});
