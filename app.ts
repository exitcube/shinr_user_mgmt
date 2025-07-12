import Fastify from 'fastify';
import envPlugin from './plugins/env';
import rootRoute from './routes/root';

export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(envPlugin);
  await fastify.register(rootRoute);

  return fastify;
}