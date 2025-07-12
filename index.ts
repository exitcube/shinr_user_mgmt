import { buildApp } from './app';

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: app.config.port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${app.config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
