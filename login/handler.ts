import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { LoginRequestBody, verifyOtpRequestBody } from './type';
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
        resendOtpHandler: async (
      request: FastifyRequest<{ Body: { otpToken: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { otpToken } = request.body;

        const userRepo = fastify.db.getRepository(User);
        const deviceRepo = fastify.db.getRepository(UserDevice);
        const userOtpRepo = fastify.db.getRepository(UserOtp);

        //  Verify and decode otpToken 
        const payload = await verifyOtpToken(otpToken);
        const { userUUId, deviceUUId } = payload;

        // Get user info
        const user = await userRepo.findOne({
          where: { uuid: userUUId, isActive: true },
        });
        if (!user) {
          throw new APIError(
            "User not found",
            404,
            "USER_NOT_FOUND",
            false,
            "User does not exist."
          );
        }
        // Get device info
        const device = await deviceRepo.findOne({
          where: { uuid: deviceUUId, userId: user.id, isActive: true },
        });
        if (!device) {
          throw new APIError(
            "Device not found",
            404,
            "DEVICE_NOT_FOUND",
            false,
            "No active device found."
          );
        }

        // 3️ Find existing OTP record for that user/device
        let otpRecord = await userOtpRepo.findOne({
          where: { userId: user.id, deviceId: device.id, isActive: true },
          order: { lastRequestedTime: "DESC" },
        });

        // 4️ Check request count limit
        if (otpRecord && otpRecord.requestCount >= 5) {
          otpRecord.isActive = false;
          await userOtpRepo.save(otpRecord);
          throw new APIError(
            "OTP limit exceeded",
            429,
            "OTP_LIMIT_EXCEEDED",
            false,
            "Too many OTP requests. Try again later."
          );
        }

        // 5️ Generate new OTP and new token
        const newOtp = generateOtp();
        const newOtpToken = await generateOtpToken({
          userUUId: user.uuid,
          deviceUUId: device.uuid,
        });

        if (!otpRecord) {
          otpRecord = userOtpRepo.create({
            userId: user.id,
            deviceId: device.id,
            otp: newOtp,
            otpToken: newOtpToken,
            lastRequestedTime: new Date(),
            requestCount: 1,
            isActive: true,
          });
        } else {
          otpRecord.otp = newOtp;
          otpRecord.otpToken = newOtpToken;
          otpRecord.lastRequestedTime = new Date();
          otpRecord.requestCount += 1;
        }

        await userOtpRepo.save(otpRecord);

        const result = createSuccessResponse(
          { otpToken: otpRecord.otpToken },
          "OTP resent successfully"
        );
        return reply.status(200).send(result);
      } catch (error) {
        throw new APIError(
          (error as APIError).message,
          (error as APIError).statusCode || 400,
          (error as APIError).code || "OTP_RESEND_FAILED",
          true,
          (error as APIError).publicMessage ||
            "Failed to resend OTP. Please try again later."
        );
      }
    }
        

    }
}

