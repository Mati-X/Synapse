import { buildApp } from './app.js';

const app = buildApp();
const port = Number(process.env.PORT) || 4000;
const host = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    await app.listen({ port, host });
    console.log(`🚀 Synapse API server listening on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
