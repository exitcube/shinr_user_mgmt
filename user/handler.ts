import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { createSuccessResponse } from '../utils/response';
import { getAddress, autoComplete } from '../utils/olaMap';
import { ReverseGeocodeBody, AddAddressBody } from './type';
import { APIError } from '../types/errors';
import { UserAddress } from '../models/UserAddress';



export default function controller(fastify: FastifyInstance, opts: FastifyPluginOptions): any {
    return {
        reverseGeocodeHandler: async (request: FastifyRequest<{ Body: ReverseGeocodeBody }>, reply: FastifyReply) => {
            try {
                const { lat, lng } = request.body;
                const locationData = await getAddress(lat, lng);
                const response = createSuccessResponse(
                    {
                        location: locationData,
                    },
                    'Address fetched successfully'
                );
                return reply.status(201).send(response);
            } catch (error) {
                throw new APIError(
                    (error as APIError).message,
                    (error as APIError).statusCode || 400,
                    (error as APIError).code || 'TOKEN_REFRESH_FAILED',
                    true,
                    (error as APIError).publicMessage || 'Failed to refresh token. Please login again.'
                );
            }
        },
         addAddressHandler: async (request: FastifyRequest<{ Body: AddAddressBody }>, reply: FastifyReply) => {
             try {
                 const { nickName, name, addressLine1, country, city, state, pinCode, latitude, longitude } = request.body;
                  
                 const userAddressRepo = fastify.db.getRepository(UserAddress);
               
                 const newAddress = userAddressRepo.create({
                     userId: (request as any).user.userId,
                     nickName: nickName ,
                     name: name,
                     addressLine1: addressLine1,
                     country: country,
                     city: city,
                     state: state,
                     pinCode: pinCode,
                     latitude: latitude,
                     longitude: longitude,
                     isActive: true
                 });
                 
                 const savedAddress = await userAddressRepo.save(newAddress);
                 
                 const response = createSuccessResponse(
                     { 
                         addressId: savedAddress.id,
                         nickName: savedAddress.nickName,
                         address: {
                             name: savedAddress.name,
                             addressLine1: savedAddress.addressLine1,
                             country: savedAddress.country,
                             city: savedAddress.city,
                             state: savedAddress.state,
                             pinCode: savedAddress.pinCode,
                             latitude: savedAddress.latitude,
                             longitude: savedAddress.longitude
                         },
                         savedAt: savedAddress.createdAt
                     }, 
                     'Address saved successfully'
                 );
                 return reply.status(201).send(response);
             } catch (error) {
                 throw new APIError(
                     (error as APIError).message,
                     (error as APIError).statusCode || 500,
                     (error as APIError).code || 'ADDRESS_SAVE_FAILED',
                     true,
                     (error as APIError).publicMessage || 'Failed to save address'
                 );
             }
         },
        autoCompleteHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const { search } = request.query as any;
                const result = await autoComplete(search);
                const response = createSuccessResponse({ result }, 'Autocomplete fetched successfully');
                return reply.status(201).send(response);
            } catch (error) {
                throw new APIError(
                    (error as APIError).message,
                    (error as APIError).statusCode || 500,
                    (error as APIError).code || 'AUTOCOMPLETE_FAILED',
                    true,
                    (error as APIError).publicMessage || 'Failed to fetch autocomplete suggestions'
                );
            }

        }
    };
}


