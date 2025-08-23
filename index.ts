
import { buildApp } from './app';
import { ENV } from "./config/env";
async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: ENV.PORT, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Call start and handle any errors
start().catch((error) => {
  console.error('❌ Startup failed:', error);
  process.exit(1);
});

 

