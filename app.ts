import Fastify from "fastify";
import typeormPlugin from "./plugins/typeorm";
import errorHandlerPlugin from "./plugins/errorHandler";
import routes from "./routes/root";
import path from "path";
import YAML from "yamljs";
import fs from "fs";

export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(typeormPlugin);
  await fastify.register(errorHandlerPlugin);

  // Register routes
  await fastify.register(routes);

  // ✅ Load YAML file 
  const file = fs.readFileSync(path.join(__dirname, "./swagger/swagger.yaml"), "utf8");
  const swaggerDocument = YAML.parse(file);

  fastify.get("/docs", async () => {
    return swaggerDocument;
  });

  return fastify;
}
