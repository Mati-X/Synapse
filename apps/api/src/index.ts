import { buildApp } from './app.js';
import { createWorkflowWorker } from './queue/workflowWorker.js';

const app = buildApp();
const port = Number(process.env.PORT) || 4000;
const host = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    const worker = createWorkflowWorker();
    console.log('⚡ BullMQ Workflow Worker initialized');

    await app.listen({ port, host });
    console.log(`🚀 Synapse API server listening on http://${host}:${port}`);

    // Graceful shutdown
    const shutdown = async () => {
      console.log('🛑 Shutting down gracefully...');
      await worker.close();
      await app.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
