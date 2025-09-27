import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { validation } from '../utils/validation';
import { loginValidate, verifyOtpValidate } from '../login/validators';
import controller from '../login/handler';

export default async function loginRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	const handler = controller(fastify, opts);
	fastify.get('/user/details', {
		preHandler: []
	},
		handler.writelater);

}


