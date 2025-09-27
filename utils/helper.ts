import { randomInt } from "crypto";

export function generateOtp(): string {
  return String(randomInt(0, 10000)).padStart(4, "0"); // range: 1000–9999
}