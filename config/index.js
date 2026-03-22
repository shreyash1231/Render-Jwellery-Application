require("dotenv").config();

const envSecrets = {
  PORT: process.env.PORT || 9757,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || "HS256",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_IDS: process.env.GOOGLE_CLIENT_IDS,

  // Email
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
  OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES || "5", 10),

  // Twilio (SMS OTP) - support both TWILIO_AUTH_TOKEN and typo TWILLO_AUTH_TOKEN
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || process.env.TWILLO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

  // Razorpay
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379", 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Security
  ENABLE_HELMET: process.env.ENABLE_HELMET === "true",
  ENABLE_HSTS: process.env.ENABLE_HSTS === "true",
  ENFORCE_HTTPS: process.env.ENFORCE_HTTPS === "true",
  ALLOW_CREDENTIALS: process.env.ALLOW_CREDENTIALS === "true",

  // Node Environment
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Validate required environment variables
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "EMAIL_USER",
  "EMAIL_PASSWORD",
];
const missingVars = requiredEnvVars.filter((v) => !envSecrets[v]);
if (missingVars.length > 0) {
  console.warn(`⚠️ Missing environment variables: ${missingVars.join(", ")}`);
}

module.exports = envSecrets;
