import { randomInt } from "crypto";

export function generateOtp(): string {
  return String(randomInt(0, 1000000)).padStart(6, "0"); // range: 100000–999999
}