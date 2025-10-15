import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { createSuccessResponse } from '../utils/response';
import { APIError } from '../types/errors';
import { getAddress } from '../utils/olaRGC';
import { ReverseGeocodeBody } from './type';
import { UserAddress } from '../models/UserAddress';


export default function controller(fastify: FastifyInstance, opts: FastifyPluginOptions):any {
    return {
        getUserDetailsHandler: async (request: FastifyRequest, reply: FastifyReply) => {
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
                throw new APIError(
                    (error as APIError).message,
                    500,
                    'USER_DETAILS_ERROR',
                    true,
                    'Failed to retrieve user details'
                );
            }
        },

        reverseGeocodeHandler: async (request: FastifyRequest<{ Body: ReverseGeocodeBody }>, reply: FastifyReply) => {
            try {
                const { lat, lng } = request.body;
                const latitude = Number(lat);
                const longitude = Number(lng);
                
                const locationData = await getAddress(latitude, longitude);
            
                const user = (request as any).user;
                if (!user || !user.userId) {
                    throw new APIError(
                        'User not authenticated',
                        401,
                        'UNAUTHORIZED',
                        true,
                        'User must be authenticated to save address'
                    );
                }
                
                const userAddressRepo = fastify.db.getRepository(UserAddress);

                const newAddress = userAddressRepo.create({
                    userId: user.userId,
                    name: locationData.name,
                    addressLine1: locationData.addressLine1,
                    country: locationData.country,
                    city: locationData.city,
                    state: locationData.state,
                    pinCode: locationData.pinCode,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    isActive: true
                });
                
              
                const savedAddress = await userAddressRepo.save(newAddress);
                
                const response = createSuccessResponse(
                    { 
                        addressId: savedAddress.id,
                        location: locationData,
                        savedAt: savedAddress.createdAt
                    }, 
                    'Address saved successfully'
                );
                return reply.status(201).send(response);
            } catch (error) {
                throw error;
            }
        }
    };
}


