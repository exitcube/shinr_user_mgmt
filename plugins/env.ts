// src/plugins/env.ts
import fp from 'fastify-plugin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const nodeEnv = process.env.NODE_ENV || 'development';

function loadEnvFile() {
  // Only load .env files in non-production
  if (nodeEnv === 'production') return;

  const envFile = path.resolve(process.cwd(), `.env.${nodeEnv}`);
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`Loaded env file: .env.${nodeEnv}`);
  } else {
    console.warn(`Missing env file: .env.${nodeEnv}`);
  }
}

// Load environment file dynamically
loadEnvFile();

export default fp(async (fastify) => {
  const config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv,
    appName: process.env.APP_NAME || 'FastifyApp',
  };

  // Validate essential envs (optional)
  if (!process.env.PORT) {
    fastify.log.warn('⚠️ PORT is not set. Using default 3000.');
  }

  // Attach config to Fastify instance
  fastify.decorate('config', config);
});
