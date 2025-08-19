import Fastify from 'fastify';
import rootRoute from './routes/root';

export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });
  await fastify.register(rootRoute);

  return fastify;
}