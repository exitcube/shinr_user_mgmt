import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { createSuccessResponse } from '../utils/response';

import { getAddress } from '../utils/olaMap';
import { ReverseGeocodeBody } from './type';
import { APIError } from '../types/errors';



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
        }
    };
}


