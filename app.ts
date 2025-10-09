import Fastify from "fastify";
import typeormPlugin from "./plugins/typeorm";
import errorHandlerPlugin from "./plugins/errorHandler";
import routes from "./routes/root";
import userDevicePlugin from "./plugins/user";


export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(typeormPlugin);
  await fastify.register(errorHandlerPlugin);
  await fastify.register(userDevicePlugin);

  // Register routes
  await fastify.register(routes);


  return fastify;
}
