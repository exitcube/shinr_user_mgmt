export type LoginRequestBody = {
  mobile : string;
};
export type verifyOtpRequestBody = {
  otpToken: string;
  otp: string;
};
export type LogoutRequestBody = {
  refreshToken: string;        // required to identify and invalidate the session
  deviceUUID?: string;         // optional, if you want to logout a specific device
};
