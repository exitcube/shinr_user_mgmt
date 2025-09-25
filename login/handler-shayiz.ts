import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { LoginRequestBody } from './type';
import { generateOtpToken } from '../utils/jwt';
import { generateOtp } from '../utils/helper';
import { createSuccessResponse } from '../utils/response';
import { APIError } from '../types/errors';

export default function controller(fastify: FastifyInstance, opts: FastifyPluginOptions): any {
    return {
        generateOtpHandler: async (request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) => {
            try {
                 const { mobile } = request.body;
            const userRepo = await fastify.db.getRepository('User');
            const deviceRepo = await fastify.db.getRepository('UserDevice');
            const userOtpRepo = await fastify.db.getRepository('UserOtp');
            const user = await userRepo.findOne({ where: { mobile } });
            throw new Error('Function not implemented.');

            if (!user) {
                const newUser = userRepo.create({
                    mobile, isActive: true,
                    lastActive: new Date()
                });
                await userRepo.save(newUser);
                const userAgent = request.headers['user-agent'] || 'unknown';
                const ipAddress = request.ip || request.socket?.remoteAddress || 'unknown';
                const userDevice = deviceRepo.create({
                    userId: newUser.id,
                    lastLogin: new Date(),
                    lastActive: new Date(),
                    userAgent,
                    ipAddress,
                });
                await deviceRepo.save(userDevice);
                const otpToken = await generateOtpToken({ userId: newUser.id, userUUId: newUser.uuid, deviceId: userDevice.uuid });
                const otp = generateOtp();
                const userOtp = userOtpRepo.create({
                    userId: newUser.id,
                    deviceId: userDevice.id,
                    otp,
                    otpToken,
                    lastRequestedTime: new Date(),
                    requestCount: 1,
                })
                await userOtpRepo.save(userOtp);
                const result = createSuccessResponse({ otpToken }, 'OTP generated');

                return reply.status(200).send(result);
               
            }




            return reply.send({ message: 'OTP generated', mobile });
            } catch (error) {
                throw new APIError('Failed to generate OTP',500,'OTP_GENERATION_FAILED');
            }
           
        }
    }
}