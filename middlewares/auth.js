import jwt from "jsonwebtoken";

// ==========================================
// 1. CHIEF AUTH MIDDLEWARE (Is Logged In?)
// ==========================================
export const auth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || 
                      req.body?.token || 
                      req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing, authorization denied",
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or expired",
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};

// ==========================================
// 2. IS STUDENT? MIDDLEWARE
// ==========================================
export const isStudent = async (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Students only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "User role cannot be verified" });
    }
};

// ==========================================
// 3. IS INSTRUCTOR? MIDDLEWARE
// ==========================================
export const isInstructor = async (req, res, next) => {
    try {
        if (req.user.role !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructors only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "User role cannot be verified" });
    }
};

// ==========================================
// 4. IS ADMIN? MIDDLEWARE
// ==========================================
export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "User role cannot be verified" });
    }
};

