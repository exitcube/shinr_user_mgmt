import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { validation } from '../utils/validation';
import { loginValidate } from './validators';

export default async function loginRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	fastify.post('/login/otp', {
		preHandler: [validation(loginValidate)]
	},
		async (request, reply) => {
			const result = { mesage: "OTP sent to your email" };
			return result;
		});

}
