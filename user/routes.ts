import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { authValidationPreHandler } from '../utils/authValidation';
import { createSuccessResponse } from '../utils/response';
import { User } from '../models/User';

export default async function userRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	
	fastify.get('/user/details', {
		preHandler: [authValidationPreHandler]
	}, async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const user = (request as any).user;

			const userDetails = {
				userId: user.userId,
				userUUId: user.userUUId,
				deviceUUId: user.deviceUUId,
				mobile: user.mobile
			};

			const result = createSuccessResponse(userDetails, "User details retrieved successfully");
			return reply.status(200).send(result);
		} catch (error) {
			return reply.status(500).send({
				success: false,
				error: {
					message: 'Failed to retrieve user details',
					code: 'USER_DETAILS_ERROR',
					statusCode: 500,
					timestamp: new Date().toISOString(),
					path: request.url,
					method: request.method
				}
			});
		}
	});

	fastify.get('/', {
		preHandler: [authValidationPreHandler]
	}, async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const user = (request as any).user;
			const userRepo = fastify.db.getRepository(User);

			// Update lastActive timestamp
			await userRepo.update({ uuid: user.userUUId }, { lastActive: new Date() });

			// Fetch only user-facing fields
			const userProfile = await userRepo.findOne({
				where: { uuid: user.userUUId },
				select: ['name', 'mobile', 'email']
			});

			if (!userProfile) {
				return reply.status(404).send({
					success: false,
					error: {
						message: 'User not found',
						code: 'USER_NOT_FOUND',
						statusCode: 404,
						timestamp: new Date().toISOString(),
						path: request.url,
						method: request.method
					}
				});
			}

			const result = createSuccessResponse(userProfile, "User profile retrieved successfully");
			return reply.status(200).send(result);

		} catch (error) {
			return reply.status(500).send({
				success: false,
				error: {
					message: 'Failed to retrieve user profile',
					code: 'USER_PROFILE_ERROR',
					statusCode: 500,
					timestamp: new Date().toISOString(),
					path: request.url,
					method: request.method
				}
			});
		}
	});
}
