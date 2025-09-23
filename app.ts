import Fastify from 'fastify';
import typeormPlugin from './plugins/typeorm';
import errorHandlerPlugin from './plugins/errorHandler';
import rootRoute from './routes/root';



export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });
  
  // Register plugins
  await fastify.register(typeormPlugin);
  await fastify.register(errorHandlerPlugin);
 
  
  // Register routes
  await fastify.register(rootRoute);


  return fastify;
}