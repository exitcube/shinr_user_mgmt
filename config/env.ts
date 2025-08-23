import dotenv from "dotenv";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dotenv.config(); // Load .env
  const envFile = `.env/.env.${process.env.NODE_ENV || "development"}`;
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  console.log(`Loaded env file: ${envFile}`);
} else {
  console.log("Running in production, using environment variables from process.env (e.g. PM2)");
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  DB_URL: process.env.DB_URL || "no-db-url-provided"
};
