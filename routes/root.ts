import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import path from 'path';
import fs from 'fs';
import yaml from "js-yaml";
import loginRoutes from '../login/routes';
import userRoutes from '../user/routes';




const swaggerPath = path.join(__dirname, "../../Swagger/swagger.yaml");
console.log(swaggerPath);
const swaggerFile = fs.readFileSync(swaggerPath, "utf8");
const swaggerDocument = yaml.load(swaggerFile);


export default async function routes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  await fastify.register(swagger, {
    openapi: swaggerDocument as any, 
  });
  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });
  fastify.get('/', async () => {
    return {
      message: 'Welcome to Shinr User Management API',
      environment: process.env.NODE_ENV || 'development',
    };
  });
  fastify.register(loginRoutes, { prefix: '/user' });
  fastify.register(userRoutes, { prefix: '/user-profile' });
}




