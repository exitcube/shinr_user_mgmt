
import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      port: number;
      nodeEnv: string;
      appName: string;
    };
  }
}
