import Fastify from 'fastify';
import typeormPlugin from './plugins/typeorm';
import rootRoute from './routes/root';


export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });
  await fastify.register(typeormPlugin);
  await fastify.register(rootRoute);

  return fastify;
}