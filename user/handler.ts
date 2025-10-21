import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { createSuccessResponse } from '../utils/response';
import { getAddress } from '../utils/olaMap';
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
                 const userId = (request as any).user.userId;

                  
                 const existingActiveAddresses = await userAddressRepo.count({ where: { userId, isActive: true } });
                 const isDefault = existingActiveAddresses === 0;

                 const newAddress = userAddressRepo.create({
                    userId: userId,
                     nickName: nickName ,
                     name: name,
                     addressLine1: addressLine1,
                     country: country,
                     city: city,
                     state: state,
                     pinCode: pinCode,
                     latitude: latitude,
                     longitude: longitude,
                    isActive: true,
                    isDefault: isDefault
                 });
                 
                 const savedAddress = await userAddressRepo.save(newAddress);
                 
                 const response = createSuccessResponse(
                     { 
                         addressId: savedAddress.id,
                         nickName: savedAddress.nickName,
                         isDefault: savedAddress.isDefault,
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

        removeAddressHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const user = (request as any).user;
                const { id } = (request.params as any)
                const addressId = Number(id);

                if (!addressId) {
                    throw new APIError('Invalid address id', 400, 'INVALID_ADDRESS_ID', true, 'Please provide a valid address id');
                }
                const userAddressRepo = fastify.db.getRepository(UserAddress);
              
                const result = await userAddressRepo.update({ id: addressId, userId: user.userId }, { isActive: false });
                if (!result.affected) {
                    throw new APIError('Address not found', 404, 'ADDRESS_NOT_FOUND', true, 'No address found for this user with the given id');
                }

                const response = createSuccessResponse({ updated: 1, addressId }, 'Address removed successfully');
                return reply.status(200).send(response);
            } catch (error) {
                throw new APIError(
                    (error as APIError).message,
                    (error as APIError).statusCode || 500,
                    (error as APIError).code || 'ADDRESS_REMOVE_FAILED',
                    true,
                    (error as APIError).publicMessage || 'Failed to deactivate address'
                );
            }
        },
         SelectAddressHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const { id } = (request.params as any)
                const addressId = Number(id);

                if (!addressId) {
                    throw new APIError('Invalid address id', 400, 'INVALID_ADDRESS_ID', true, 'Please provide a valid address id');
                }
                 const userAddressRepo = fastify.db.getRepository(UserAddress);
                 const userId = (request as any).user?.userId;

                  
                 const result = await userAddressRepo.findOne({ where: { id: addressId, userId, isActive: true } });
                if (!result) {
                    throw new APIError('Address not found', 404, 'ADDRESS_NOT_FOUND', true, 'No address found for this user with the given id');
                }

                const response = createSuccessResponse({ selected: 1, addressId }, 'Address selected successfully');
                return reply.status(200).send(response);
            } catch (error) {
                throw new APIError(
                    (error as APIError).message,
                    (error as APIError).statusCode || 500,
                     (error as APIError).code || 'ADDRESS_SELECTION_FAILED',
                    true,
                     (error as APIError).publicMessage || 'Failed to select address'
                );
            }
        }
    };
}


