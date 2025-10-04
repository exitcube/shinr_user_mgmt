import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { LoginRequestBody, verifyOtpRequestBody, LogoutRequestBody } from './type';
import { generateOtpToken, generateRefreshToken, signAccessToken, verifyOtpToken } from '../utils/jwt';
import { generateOtp } from '../utils/helper';
import { createSuccessResponse } from '../utils/response';
import { APIError } from '../types/errors';
import { User, UserDevice, UserOtp, UserToken } from '../models';
import { RefreshTokenStatus } from '../utils/constant';

export default function controller(fastify: FastifyInstance, opts: FastifyPluginOptions): any {
    return {
        generateOtpHandler: async (request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) => {
            try {
                const { mobile } = request.body;

                // Create all the db repositories
                const userRepo = fastify.db.getRepository(User);
                const deviceRepo = fastify.db.getRepository(UserDevice);
                const userOtpRepo = fastify.db.getRepository(UserOtp);
                const userTokenRepo = fastify.db.getRepository(UserToken);


                let user = await userRepo.findOne({ where: { mobile, isActive: true } });
                if (!user) {
                    user = userRepo.create({
                        mobile,
                        isActive: true,
                        lastActive: new Date(),
                    });
                    await userRepo.save(user);
                }


                const existingDevice = await deviceRepo.findOne({
                    where: { userId: user.id, isActive: true },
                });
                if (existingDevice) {
                    await deviceRepo.remove(existingDevice);
                    await userOtpRepo.delete({ userId: user.id, deviceId: existingDevice.id });
                    await userTokenRepo.update({ userId: user.id, deviceId: existingDevice.id }, { isActive: false, refreshTokenStatus: RefreshTokenStatus.INACTIVE });

                }


                const userAgent = request.headers["user-agent"] || "unknown";
                const ipAddress = request.ip || request.socket?.remoteAddress || "unknown";
                const userDevice = deviceRepo.create({
                    userId: user.id,
                    lastLogin: new Date(),
                    lastActive: new Date(),
                    userAgent,
                    ipAddress,
                });
                await deviceRepo.save(userDevice);


                user.lastActive = new Date();
                await userRepo.save(user);


                const otpToken = await generateOtpToken({
                    // userId: user.id,
                    userUUId: user.uuid,
                    deviceUUId: userDevice.uuid
                });
                const otp = generateOtp();
                const userOtp = userOtpRepo.create({
                    userId: user.id,
                    deviceId: userDevice.id,
                    otp,
                    otpToken,
                    lastRequestedTime: new Date(),
                    requestCount: 1,
                });
                await userOtpRepo.save(userOtp);


                const result = createSuccessResponse({ otpToken }, "OTP generated");
                return reply.status(200).send(result);

            } catch (error) {
                throw new APIError(
                    (error as APIError).message,
                    500,
                    "OTP_GENERATION_FAILED",
                    true,
                    "Failed to generate OTP. Please try again later."
                );
            }
        },
        verifyOtpHandler: async (request: FastifyRequest<{ Body: verifyOtpRequestBody }>, reply: FastifyReply) => {
            try {
                const { otpToken, otp } = request.body;
                // Create all the db repositories
                const userRepo = fastify.db.getRepository(User);
                const userOtpRepo = fastify.db.getRepository(UserOtp);
                const userTokenRepo = fastify.db.getRepository(UserToken);

                // verify otp
                const payload = await verifyOtpToken(otpToken);
                console.log("payload", payload);
                const user = await userRepo.findOne({
                    where: { uuid: payload.userUUId, isActive: true },
                    relations: ['device']
                });
                if (!user) {
                    throw new APIError(
                        "User not found",
                        400,
                        "USER_NOT_FOUND",
                        false,
                        "User does not exist. Please register."
                    );
                }
                const otpRecord = await userOtpRepo.findOne({
                    where: { userId: user.id, deviceId: user.device.id, isActive: true },
                });

                if (otpRecord?.otpToken !== otpToken) {
                    throw new APIError(
                        "Invalid OTP token",
                        400,
                        "INVALID_OTP_TOKEN",
                        false,
                        "The provided OTP token is invalid. Please login again."
                    );
                }
                const DEV_OTP = process.env.NODE_ENV === "development" ? process.env.DEV_OTP || "123456" : null;
                if (otp !== DEV_OTP && otpRecord?.otp !== otp) {
                    throw new APIError(
                        "Incorrect OTP",
                        400,
                        "INVALID_OTP",
                        false,
                        "The provided OTP is invalid. Please request a new OTP."
                    );
                }
                await userTokenRepo.update(
                    { userId: user.id, deviceId: user.device.id, isActive: true }, // condition
                    {
                        isActive: false,
                        refreshTokenStatus: RefreshTokenStatus.INACTIVE
                    } // update values
                );
                const userToken = userTokenRepo.create({
                    userId: user.id,
                    deviceId: user.device.id,
                    refreshTokenStatus: RefreshTokenStatus.ACTIVE,
                    isActive: true,
                    refreshToken: "",
                    accessToken: ""
                });

                await userTokenRepo.save(userToken);

                const refreshToken = await generateRefreshToken({ userUUId: user.uuid, deviceUUId: user.device.uuid, tokenId: userToken.id });
                const accessToken = await signAccessToken({ userId: user.id, userUUId: user.uuid, deviceUUId: user.device.uuid, mobile: user.mobile });
                console.log(refreshToken, accessToken);
                const refreshTokenExpiry = new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "60") * 24 * 60 * 60 * 1000);
                userToken.refreshToken = refreshToken;
                userToken.accessToken = accessToken;
                userToken.refreshTokenExpiry = refreshTokenExpiry;
                await userTokenRepo.save(userToken);
                otpRecord.isActive = false;
                await userOtpRepo.save(otpRecord);
                const result = createSuccessResponse({ accessToken, refreshToken }, "OTP verified and tokens generated");
                return reply.status(200).send(result);



            } catch (error) {
                throw new APIError(
                    (error as APIError).message,
                    (error as APIError).statusCode || 400,
                    (error as APIError).code || "OTP_VERIFICATION_FAILED",
                    true,
                    (error as APIError).publicMessage || "Failed to verify OTP. Please try again later."
                );
            }
        },
        logoutHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                // Extract refresh token from Authorization header
                const authHeader = request.headers.authorization;
                if (!authHeader) {
                    throw new APIError(
                        "Authorization header is required",
                        401,
                        "MISSING_AUTH_TOKEN",
                        false,
                        "Authorization header is missing"
                    );
                }

                // Extract token from "Bearer <token>" format
                const refreshToken = authHeader.startsWith('Bearer ') 
                    ? authHeader.slice(7) 
                    : authHeader;

                if (!refreshToken) {
                    throw new APIError(
                        "Invalid authorization format",
                        401,
                        "INVALID_AUTH_FORMAT",
                        false,
                        "Authorization header must be in format 'Bearer <token>'"
                    );
                }

                // Create all the db repositories
                const userTokenRepo = fastify.db.getRepository(UserToken);
                const deviceRepo = fastify.db.getRepository(UserDevice);
                const userOtpRepo = fastify.db.getRepository(UserOtp);

                // Find the active token record using the refresh token
                const tokenRecord = await userTokenRepo.findOne({
                    where: { 
                        refreshToken, 
                        isActive: true,
                        refreshTokenStatus: RefreshTokenStatus.ACTIVE
                    }
                });

                if (!tokenRecord) {
                    throw new APIError(
                        "Invalid or expired refresh token",
                        401,
                        "INVALID_REFRESH_TOKEN",
                        false,
                        "The provided refresh token is invalid or expired."
                    );
                }

                // Deactivate the token
                await userTokenRepo.update(
                    { id: tokenRecord.id },
                    {
                        isActive: false,
                        refreshTokenStatus: RefreshTokenStatus.INACTIVE
                    }
                );

                // Deactivate the device
                await deviceRepo.update(
                    { id: tokenRecord.deviceId },
                    { isActive: false }
                );

                // Deactivate any active OTPs for this device
                await userOtpRepo.update(
                    { userId: tokenRecord.userId, deviceId: tokenRecord.deviceId, isActive: true },
                    { isActive: false }
                );

                const result = createSuccessResponse({}, "Logout successful");
                return reply.status(200).send(result);

            } catch (error) {
                throw new APIError(
                    (error as APIError).message,
                    (error as APIError).statusCode || 400,
                    (error as APIError).code || "LOGOUT_FAILED",
                    true,
                    (error as APIError).publicMessage || "Failed to logout. Please try again later."
                );
            }
        }

    }
}

