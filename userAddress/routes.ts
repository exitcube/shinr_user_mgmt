import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authValidationPreHandler } from '../utils/authValidation';
import controller from './handler';
import { validation } from '../utils/validation';
import { reverseGeocodeValidate, addAddressValidate,autoSearchingValidate } from './validators';

export default async function userRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const handler = controller(fastify, opts);
    fastify.post('/get-location/reverse-geocode',{ preHandler: [authValidationPreHandler, validation(reverseGeocodeValidate)] }, handler.reverseGeocodeHandler);
    fastify.post('/add-address',{preHandler: [authValidationPreHandler,validation(addAddressValidate)]},handler.addAddressHandler);
    fastify.post('/remove-address/:id',{preHandler: [authValidationPreHandler]},handler.removeAddressHandler);
    fastify.post('/select-address/:id',{preHandler: [authValidationPreHandler]},handler.selectAddressHandler);
    fastify.get('/location-autocomplete',{preHandler: [authValidationPreHandler,validation(autoSearchingValidate)]},handler.autoCompleteHandler);
}
 
