import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { telemetryBroker } from '../telemetry/telemetryBroker.js';
import { db } from '../db/index.js';
import { executionRuns } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const runRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get('/:runId/telemetry', async (request, reply) => {
    const { runId } = request.params as { runId: string };

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    reply.raw.write(`data: ${JSON.stringify({ type: 'CONNECTED', runId, timestamp: new Date().toISOString() })}\n\n`);

    const unsubscribe = telemetryBroker.subscribe(runId, (event) => {
      reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    // Clean up subscription when the client disconnects
    request.raw.on('close', () => {
      unsubscribe();
    });
  });

  app.get('/:runId', async (request, reply) => {
    const { runId } = request.params as { runId: string };

    const [run] = await db
      .select()
      .from(executionRuns)
      .where(eq(executionRuns.id, runId));

    if (!run) {
      return reply.status(404).send({ error: `Execution run ${runId} not found` });
    }

    return run;
  });
};
