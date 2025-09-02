import Fastify from 'fastify';
import typeormPlugin from './plugins/typeorm';
import errorHandlerPlugin from './plugins/errorHandler';
import rootRoute from './routes/root';
import path from 'path';
import fastifyStatic from '@fastify/static';
// import usersRoute from './routes/users';


export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });
    // Swagger UI
    await fastify.register(fastifyStatic, {
      root: path.join(__dirname, 'swagger'),
      prefix: '/swagger/', // URL will be /swagger/swagger.yaml
    });
    
    const swaggerUiDist = require('swagger-ui-dist');
    const swaggerUiPath: string = swaggerUiDist.getAbsoluteFSPath();
    await fastify.register(fastifyStatic, {
      root: swaggerUiPath,
      prefix: '/docs/',
      decorateReply: false,
    });
    
    // Redirect /docs to the UI with our spec
    fastify.get('/docs', async (request, reply) => {
      return reply.redirect('/docs/index.html?url=/swagger/swagger.yaml');
    });
  
  // Register plugins
  await fastify.register(typeormPlugin);
  await fastify.register(errorHandlerPlugin);

 

  // Register routes
  await fastify.register(rootRoute);
  // await fastify.register(usersRoute, { prefix: '/users' });

  return fastify;
}