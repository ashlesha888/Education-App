const cookieOptions = {

  httpOnly: true,

  secure:
    process.env.NODE_ENV ===
    "production",

  sameSite:
    process.env.NODE_ENV ===
    "production"
      ? "none"
      : "lax",

  maxAge:
    7 * 24 * 60 * 60 * 1000,

};

res.cookie(
  "token",
  token,
  cookieOptions
);
import jwt from "jsonwebtoken";

export const generateToken = (
  userId
) => {

  return jwt.sign(

    {
      id: userId,
    },

    process.env.JWT_SECRET,

    {
      expiresIn:
        process.env.JWT_EXPIRES_IN,
    }

  );

};

export const sendToken = (
  user,
  statusCode,
  res
) => {

  const token =
    generateToken(user._id);

  res.cookie(
    "token",
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    }
  );

  return res.status(statusCode).json({

    success: true,

    token,

    data: user,

  });

};