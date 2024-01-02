import { config } from "dotenv";
config();

const Config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME,
  FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  CLIENT_DOMAIN: process.env.CLIENT_DOMAIN
};

export default Config;
