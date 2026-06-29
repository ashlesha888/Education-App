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

export const isStudent = authorize("Student");
export const isInstructor = authorize("Instructor");
export const isAdmin = authorize("Admin");