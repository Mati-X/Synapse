import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.js';
import { workflowRoutes } from './routes/workflows.js';
import { runRoutes } from './routes/runs.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: process.env.NODE_ENV === 'test' ? false : true,
  });

  app.register(cors, {
    origin: '*',
  });

  app.register(healthRoutes);
  app.register(workflowRoutes, { prefix: '/api/workflows' });
  app.register(runRoutes, { prefix: '/api/runs' });

  return app;
}
