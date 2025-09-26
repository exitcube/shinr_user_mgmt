
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
  userId: number;
  userUUId : string;
  deviceUUId: string;
}


export type refreshTokenPayloadType = {
  userId: number;
  userUUId : string;
  deviceUUId: string;
}

export type accessTokenPayloadType = {
  userId: number;
  userUUId : string;
  deviceUUId: string;
  mobile : string;
}