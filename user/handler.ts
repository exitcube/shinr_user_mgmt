import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { createSuccessResponse } from '../utils/response';
import { APIError } from '../types/errors';
import { getAddress } from '../utils/olaRGC';
import { ReverseGeocodeBody } from './type';
import { UserAddress } from '../models/UserAddress';


export default function controller(fastify: FastifyInstance, opts: FastifyPluginOptions):any {
    return {
        

        reverseGeocodeHandler: async (request: FastifyRequest<{ Body: ReverseGeocodeBody }>, reply: FastifyReply) => {
            try {
                const { lat, lng } = request.body;
        
                
                const locationData = await getAddress(lat,lng);
            
                
                 
                const response = createSuccessResponse(
                    { 
                         
                        location: locationData,
                        
                    }, 
                    'Address fetched successfully'
                );
                return reply.status(201).send(response);
            } catch (error) {
                throw error;
            }
        }
    };
}


