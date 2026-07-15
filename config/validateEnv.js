const requiredEnv = [
  "MONGO_URL",
  "JWT_SECRET",
  "CLOUDINARY_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "MAIL_HOST",
  "MAIL_USER",
  "MAIL_PASS",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
];
//console.log("MONGO_URL:", process.env.MONGO_URL);
//console.log("All env keys:", Object.keys(process.env));
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(
      `Missing required environment variable: ${key}`
    );
  }
});