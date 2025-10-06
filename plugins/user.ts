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
    getUserDeviceInfo: (params: UserDeviceParams) => Promise<User | null>;
  }
}

const userDevicePlugin: FastifyPluginAsync = async (fastify) => {
  try {
    fastify.decorate('getUserDeviceInfo', async ({ userUUID, deviceUUID }: UserDeviceParams) => {
      if (!userUUID) throw new Error('userUUID is required');

      const userRepo = fastify.db.getRepository(User);

      const userQuery = userRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.device', 'device')
        .select([
          'user.id',
          'user.name',
          'user.email',
          'user.mobile',
          'user.lastActive',
          'device.id',
          'device.lastLogin',
          'device.userAgent',
          'device.ipAddress'
        ])
        .where('user.uuid = :userUUID', { userUUID })
        .andWhere('user.isActive = :isActive', { isActive: true });

      if (deviceUUID) {
        userQuery.andWhere('device.uuid = :deviceUUID', { deviceUUID });
      } else {
        userQuery.andWhere('device.isActive = :isActive', { isActive: true });
      }

      const user = await userQuery.getOne();

      return user; // user.device contains device info
    });
  } catch (error: any) {
    throw new Error(error.message); // <-- just throw error message
  }
};

export default fp(userDevicePlugin, { name: 'userDevicePlugin' });
