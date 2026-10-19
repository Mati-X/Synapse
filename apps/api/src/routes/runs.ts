import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { telemetryBroker } from '../telemetry/telemetryBroker.js';
import { db } from '../db/index.js';
import { executionRuns } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const runRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // 1. Strumień SSE z telemetrią na żywo dla danego runId
  app.get('/:runId/telemetry', async (request, reply) => {
    const { runId } = request.params as { runId: string };

    // Ustawienie nagłówków standardu Server-Sent Events (SSE)
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    // Wysłanie wstępnego pinga potwierdzającego nawiązanie połączenia
    reply.raw.write(`data: ${JSON.stringify({ type: 'CONNECTED', runId, timestamp: new Date().toISOString() })}\n\n`);

    // Subskrypcja zdarzeń z brokera
    const unsubscribe = telemetryBroker.subscribe(runId, (event) => {
      reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    // Sprzątanie po zamknięciu połączenia przez klienta (zamknięcie karty/odpięcie)
    request.raw.on('close', () => {
      unsubscribe();
    });
  });

  // 2. Pobranie statusu i historii pojedynczego uruchomienia z bazy
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
