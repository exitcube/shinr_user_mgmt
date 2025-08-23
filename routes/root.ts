import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function rootRoute(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
){
  fastify.get('/', async () => {
    return {
      message: 'Welcome to Shinr User Management API',
      environment: process.env.NODE_ENV || 'development',
    };
  });
}




