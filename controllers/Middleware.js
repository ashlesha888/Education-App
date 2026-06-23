import jwt from "jsonwebtoken";
import User from "../models/user.js";

// ==========================================
// 1. CHIEF AUTH MIDDLEWARE (Is Logged In?)
// ==========================================
export const auth = async (req, res, next) => {
    try {
        // Extract token from cookies, body, or Authorization Header
        const token = req.cookies?.token || 
                      req.body?.token || 
                      req.header("Authorization")?.replace("Bearer ", "");

        // If token is missing, deny access immediately
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing, authorization denied",
            });
        }

        // Verify the token integrity using your secret key
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach the decoded user data payload (id, email, role) to the request object
            req.user = decode;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or expired",
            });
        }

        // Move to the next middleware or controller function
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
