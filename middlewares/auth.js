import jwt from "jsonwebtoken";
import User from "../models/user.js";

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





