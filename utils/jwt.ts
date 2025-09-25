import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";
import { otpTokenPayloadType } from "../types/config";
const OTP_SECRET = new TextEncoder().encode(process.env.OTP_SECRET || "otptokensceret");
export async function generateOtpToken(payload : otpTokenPayloadType) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(OTP_SECRET);
}

export async function verifyOtpToken(token: string) {
  const { payload } = await jwtVerify(token, OTP_SECRET, { algorithms: ["HS256"] });
  return payload as { userId: string; deviceId: string; jti: string };
}