import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';

describe('Auth & Workflows UUID API Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  const testEmail = `dev_${Date.now()}@synapse.internal`;
  const testPassword = 'StrongPassword123!';
  let authToken = '';

  it('registers a new user and returns a session token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: testEmail,
        password: testPassword,
        name: 'Lead Developer',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.user.email).toBe(testEmail);
    expect(body.user.role).toBe('developer');
    expect(body.token).toBeDefined();
    authToken = body.token;
  });

  it('rejects duplicate email registration', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: testEmail,
        password: testPassword,
        name: 'Duplicate',
      },
    });

    expect(response.statusCode).toBe(409);
  });

  it('logs in with correct credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: testEmail,
        password: testPassword,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.user.email).toBe(testEmail);
    expect(body.token).toBeDefined();
  });

  it('rejects login with invalid password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: testEmail,
        password: 'WrongPassword',
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it('fetches current user with bearer token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.user.email).toBe(testEmail);
  });

  it('creates and returns a workflow with UUID in PostgreSQL', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/workflows',
      payload: {
        name: 'Order Settlement DAG',
        nodes: [
          {
            id: 'trigger_1',
            type: 'triggerNode',
            position: { x: 0, y: 0 },
            data: { title: 'Order Webhook', type: 'TRIGGER', config: {}, status: 'IDLE' },
          },
        ],
        edges: [],
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(body.name).toBe('Order Settlement DAG');
  });

  it('fetches workflow list from PostgreSQL', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/workflows',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body.workflows)).toBe(true);
    expect(body.workflows.length).toBeGreaterThan(0);
  });
});
