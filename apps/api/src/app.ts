import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.js';
import { workflowRoutes } from './routes/workflows.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: process.env.NODE_ENV === 'test' ? false : true,
  });

  // CORS
  app.register(cors, {
    origin: '*',
  });

  // REGISTRIES
  app.register(healthRoutes);
  app.register(workflowRoutes, { prefix: '/api/workflows' });

  return app;
}
