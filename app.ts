<<<<<<< HEAD
import Fastify from 'fastify';
import typeormPlugin from './plugins/typeorm';
import errorHandlerPlugin from './plugins/errorHandler';
import rootRoute from './routes/root';
// import usersRoute from './routes/users';
=======
import Fastify from "fastify";
import typeormPlugin from "./plugins/typeorm";
import errorHandlerPlugin from "./plugins/errorHandler";
import rootRoute from "./routes/root";
import path from "path";
import fastifyStatic from "@fastify/static";
import * as swaggerUiDist from "swagger-ui-dist";

>>>>>>> c42e1e4 (Merge branch 'feature/add-swagger' of https://github.com/exitcube/shinr_user_mgmt into feature/add-swagger)


export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });
<<<<<<< HEAD
  
  // Register plugins
  await fastify.register(typeormPlugin);
  await fastify.register(errorHandlerPlugin);
 
  
=======

  // Swagger YAML spec static
  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, "swagger"),
    prefix: "/swagger/", // URL will be /swagger/swagger.yaml
  });

  // Swagger UI static files
  const swaggerUiPath: string = swaggerUiDist.getAbsoluteFSPath();
  await fastify.register(fastifyStatic, {
    root: swaggerUiPath,
    prefix: "/docs/",
    decorateReply: false,
  });

  // Redirect /docs → Swagger UI with our spec
  fastify.get("/docs", async (_request, reply) => {
    return reply.redirect("/docs/index.html?url=/swagger/swagger.yaml");
  });

  // Register plugins
  await fastify.register(typeormPlugin);
  await fastify.register(errorHandlerPlugin);

>>>>>>> c42e1e4 (Merge branch 'feature/add-swagger' of https://github.com/exitcube/shinr_user_mgmt into feature/add-swagger)
  // Register routes
  await fastify.register(rootRoute);
  // await fastify.register(usersRoute, { prefix: "/users" });

  return fastify;
}
