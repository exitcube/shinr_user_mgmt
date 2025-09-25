
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

export type otpTokenPayloadType = {
  userId: string;
  userUUId : string;
  deviceId: string;
}
