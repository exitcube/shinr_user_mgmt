import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { validation } from '../utils/validation';
import { loginValidate } from './validators';
import controller from './handler-shayiz';

export default async function loginRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	const handler =  controller(fastify,opts);
	fastify.post('/login/otp', {
		preHandler: [validation(loginValidate)]
	},	handler.generateOtpHandler);

}


