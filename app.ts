import Fastify from "fastify";
import typeormPlugin from "./plugins/typeorm";
import errorHandlerPlugin from "./plugins/errorHandler";
import routes from "./routes/root";


export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(typeormPlugin);
  await fastify.register(errorHandlerPlugin);

  // Register routes
  await fastify.register(routes);


  return fastify;
}
