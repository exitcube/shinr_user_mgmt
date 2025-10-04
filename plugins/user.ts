import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { User } from '../models/User';
import { UserDevice } from '../models/UserDevice';
import { DataSource } from 'typeorm';

interface UserDeviceParams {
  userUUID: string;
  deviceUUID?: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    db: DataSource;
    getUserDeviceInfo: (params: UserDeviceParams) => Promise<{ user: User; device?: UserDevice } | null>;
  }
}

const userDevicePlugin: FastifyPluginAsync = async (fastify) => {
  try {
    fastify.decorate('getUserDeviceInfo', async ({ userUUID, deviceUUID }: UserDeviceParams) => {
      if (!userUUID) throw new Error('userUUID is required');

      const userRepo = fastify.db.getRepository(User);
      const deviceRepo = fastify.db.getRepository(UserDevice);

      const user = await userRepo.findOne({ where: { uuid: userUUID } });
      if (!user) return null;

      let device: UserDevice | undefined = undefined;

      if (deviceUUID) {
        device = await deviceRepo.findOne({
          where: { uuid: deviceUUID, userId: user.id },
        }) ?? undefined;
      }

      return { user, device };
    });

    console.log('✅ User-Device plugin registered successfully');
  } catch (error) {
    console.error('❌ Failed to register User-Device plugin:', error);
    throw error;
  }
};

export default fp(userDevicePlugin, { name: 'userDevicePlugin' });
