import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing, authorization denied",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

const authorize = (role) => {
  return (req, res, next) => {
    try {
      if (req.user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `This route is accessible only to ${role}s`,
        });
      }

      next();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong while verifying user role",
      });
    }
  };
};
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const auth = async (
  req,
  res,
  next
) => {

  try {

    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace(
        "Bearer ",
        ""
      );

    if (!token) {

      return res.status(401).json({

        success: false,

        message: "Authentication token missing.",

      });

    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {

      return res.status(401).json({

        success: false,

        message: "User no longer exists.",

      });

    }

    req.user = user;

    next();

  } catch (error) {

    if (
      error.name === "JsonWebTokenError"
    ) {

      return res.status(401).json({

        success: false,

        message: "Invalid authentication token.",

      });

    }

    if (
      error.name === "TokenExpiredError"
    ) {

      return res.status(401).json({

        success: false,

        message: "Authentication token has expired.",

      });

    }

    next(error);

  }

};
export const authorize = (
  ...roles
) => {

  return (
    req,
    res,
    next
  ) => {

    if (
      !roles.includes(
        req.user.accountType
      )
    ) {

      return res.status(403).json({

        success: false,

        message: "Access denied.",

      });

    }

    next();

  };

};

export const isStudent = authorize("Student");
export const isInstructor = authorize("Instructor");
export const isAdmin = authorize("Admin");





