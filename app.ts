import Fastify from 'fastify';
import typeormPlugin from './plugins/typeorm';
import errorHandlerPlugin from './plugins/errorHandler';
import routes from './routes/root';



export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });
  
  // Register plugins
  await fastify.register(typeormPlugin);
  await fastify.register(errorHandlerPlugin);
 
  
  // Register routes
  await fastify.register(routes);
// add the comment to verify the jwt secret keys are present or not else it should not runt eh code

  return fastify;
}