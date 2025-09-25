// import { FastifyInstance } from 'fastify';
// import { DataSource } from 'typeorm';
// import { User } from '../models/User';
// import { UserOtp } from '../models/UserOtp';
// import { UserDevice } from '../models/UserDevice';
// import { UserToken } from '../models/UserToken';
// import crypto from 'crypto';
// import jwt from 'jsonwebtoken';
// import { createSuccessResponse } from '../utils/response';

// const OTP_EXPIRY_MINUTES = 5;
// const MAX_ACTIVE_DEVICES = 2;

// function generateNumericOtp(length: number = 6): string {
//     const digits = '0123456789';
//     let otp = '';
//     for (let i = 0; i < length; i++) {
//         otp += digits[Math.floor(Math.random() * 10)];
//     }
//     return otp;
// }

// function generateOpaqueToken(): string {
//     return crypto.randomBytes(24).toString('hex');
// }

// function signJwt(payload: object, secret: string, expiresIn: string = '1h'): string {
//     return jwt.sign(payload as any, secret, { expiresIn });
// }

// export async function generateOtpHandler(fastify: FastifyInstance, body: { mobile?: string }) {
//     const { mobile } = body || {};
//     if (!mobile) {
//         fastify.httpErrors.badRequest('mobile is required');
//     }

//     const db: DataSource = fastify.db;
//     const userRepo = db.getRepository(User);
//     const userOtpRepo = db.getRepository(UserOtp);

//     let user = await userRepo.findOne({ where: { mobile } });
//     if (!user) {
//         user = userRepo.create({ mobile, isActive: true, lastActive: new Date() });
//         await userRepo.save(user);
//     }

//     const otp = generateNumericOtp(6);
//     const otpToken = generateOpaqueToken();

//     const now = new Date();
//     const userOtp = userOtpRepo.create({
//         userId: user.id,
//         otp,
//         otpToken,
//         lastRequestedTime: now,
//         requestCount: 1,
//         isActive: true
//     });
//     await userOtpRepo.save(userOtp);

//     // In real app, send OTP via SMS instead of returning it
//     return createSuccessResponse({ otpToken, userId: user.id }, 'OTP generated');
// }

// export async function loginWithOtpHandler(
//     fastify: FastifyInstance,
//     body: { mobile?: string; otp?: string; otpToken?: string; userAgent?: string; ipAddress?: string }
// ) {
//     const { mobile, otp, otpToken } = body || ({} as any);
//     if (!mobile || !otp || !otpToken) {
//         fastify.httpErrors.badRequest('mobile, otp and otpToken are required');
//     }

//     const db: DataSource = fastify.db;
//     const userRepo = db.getRepository(User);
//     const userOtpRepo = db.getRepository(UserOtp);
//     const deviceRepo = db.getRepository(UserDevice);
//     const tokenRepo = db.getRepository(UserToken);

//     const user = await userRepo.findOne({ where: { mobile } });
//     if (!user) {
//         fastify.httpErrors.unauthorized('Invalid credentials');
//     }

//     const record = await userOtpRepo.findOne({ where: { userId: user!.id, otpToken, isActive: true } });
//     if (!record) {
//         fastify.httpErrors.unauthorized('Invalid or expired OTP token');
//     }

//     // Check expiry
//     const expiresAt = new Date(record!.lastRequestedTime);
//     expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);
//     if (new Date() > expiresAt) {
//         record!.isActive = false;
//         await userOtpRepo.save(record!);
//         fastify.httpErrors.unauthorized('OTP expired');
//     }

//     if (record!.otp !== otp) {
//         fastify.httpErrors.unauthorized('Invalid OTP');
//     }

//     // Invalidate OTP after successful use
//     record!.isActive = false;
//     await userOtpRepo.save(record!);

//     // Enforce device limit
//     const activeDevices = await deviceRepo.count({ where: { userId: user!.id, isActive: true } });
//     const userAgent = body.userAgent || 'unknown';
//     const ipAddress = body.ipAddress || 'unknown';

//     let device = await deviceRepo.findOne({ where: { userId: user!.id, userAgent, ipAddress } });

//     if (!device) {
//         if (activeDevices >= MAX_ACTIVE_DEVICES) {
//             fastify.httpErrors.forbidden('Maximum active devices reached');
//         }
//         device = deviceRepo.create({
//             userId: user!.id,
//             lastLogin: new Date(),
//             lastActive: new Date(),
//             userAgent,
//             ipAddress,
//             isActive: true,
//             lastLogoutTime: new Date()
//         });
//         await deviceRepo.save(device);
//     } else {
//         device.lastLogin = new Date();
//         device.lastActive = new Date();
//         device.isActive = true;
//         await deviceRepo.save(device);
//     }

//     // Issue tokens
//     const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
//     const accessToken = signJwt({ sub: user!.id, mobile: user!.mobile, deviceId: device.id }, jwtSecret, process.env.JWT_EXPIRES_IN || '1h');
//     const refreshToken = generateOpaqueToken();
//     const refreshTokenExpiry = new Date();
//     refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);

//     const userToken = tokenRepo.create({
//         userId: user!.id,
//         deviceId: device.id,
//         accessToken,
//         refreshToken,
//         refreshTokenExpiry,
//         refreshTokenStatus: 'active',
//         isActive: true
//     });
//     await tokenRepo.save(userToken);

//     user.lastActive = new Date();
//     user.isActive = true;
//     await userRepo.save(user);

//     return createSuccessResponse({ token: accessToken, refreshToken, expiresIn: process.env.JWT_EXPIRES_IN || '1h' }, 'Login successful');
// }
