import dotenv from "dotenv";

dotenv.config(); // Load .env file

export const config = {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
};
