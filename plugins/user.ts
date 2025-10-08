import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { User } from '../models/User';
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

      
      const where: any = { uuid: userUUID, isActive: true };
      if (deviceUUID) {
        where.device = { uuid: deviceUUID, isActive: true };
      }

      // Fetch user along with device using relation 
      const user = await userRepo.findOne({
        where,
        relations: ['device'], 
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          lastActive: true,
          device: {
            id: true,
            lastLogin: true,
            userAgent: true,
            ipAddress: true,
          }
        }
      });

      return user;
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default fp(userDevicePlugin, { name: 'userDevicePlugin' });
