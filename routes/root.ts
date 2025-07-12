import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function rootRoute(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
){
  fastify.get('/', async () => {
    return {
      message: `Welcome to ${fastify.config.appName}`,
      environment: fastify.config.nodeEnv,
    };
  });
}




