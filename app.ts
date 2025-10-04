import Fastify from 'fastify';
import typeormPlugin from './plugins/typeorm';
import userDevicePlugin from './plugins/user';
import errorHandlerPlugin from './plugins/errorHandler';
import routes from './routes/root';
import path from 'path';
import YAML from 'yamljs';
import fs from 'fs';

export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(typeormPlugin);
  await fastify.register(errorHandlerPlugin);

  // Register routes
  await fastify.register(routes);

  // ✅ Load Swagger YAML file
  const swaggerPath = path.join(__dirname, './swagger/swagger.yaml');
  const swaggerDoc = YAML.load(swaggerPath);

  // ✅ Optional: serve YAML as JSON at /docs endpoint
  fastify.get('/docs', async () => {
    return swaggerDoc;
  });

  return fastify;
}
