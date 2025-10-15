import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authValidationPreHandler } from '../utils/authValidation';
import controller from './handler';
import { validation } from '../utils/validation';
import { reverseGeocodeValidate } from './validators';

export default async function userRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	const handler = controller(fastify, opts);

	fastify.get('/user/details', { preHandler: [authValidationPreHandler] }, handler.getUserDetailsHandler);

    fastify.post('/get-location', { preHandler: [authValidationPreHandler, validation(reverseGeocodeValidate)] }, handler.reverseGeocodeHandler);
}
