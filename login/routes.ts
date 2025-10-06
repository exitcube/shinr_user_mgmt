import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { validation } from '../utils/validation';
import { loginValidate, verifyOtpValidate } from './validators';
import controller from './handler';
import { deviceIdValidationPreHandler } from '../utils/authValidation';

export default async function loginRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	const handler = controller(fastify, opts);
	fastify.post('/login/otp', {
		preHandler: [validation(loginValidate)]
	},
		handler.generateOtpHandler);

	fastify.post('/login/verify-otp', {
		preHandler: [deviceIdValidationPreHandler,validation(verifyOtpValidate)]
	},
		handler.verifyOtpHandler);



}


