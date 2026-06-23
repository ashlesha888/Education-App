import express from "express";
import { sendOTP, signUp, login } from "../controllers/authController.js";
import { auth, isStudent, isInstructor, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (No login required)
// ==========================================

// Route for sending OTP to user's email
router.post("/send-otp", sendOTP);

// Route for registering a new user
router.post("/signup", signUp);

// Route for logging in an existing user
router.post("/login", login);

// ==========================================
// PROTECTED TEST ROUTES (Requires login)
// ==========================================

// Simple route accessible to any logged-in user
router.get("/dashboard", auth, (req, res) => {
    return res.status(200).json({
        success: true,
        message: `Welcome to your dashboard, ${req.user.email}!`,
    });
});

// Route accessible only to logged-in Students
router.get("/student-portal", auth, isStudent, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to the protected Student Portal!",
    });
});

// Route accessible only to logged-in Instructors
router.get("/instructor-portal", auth, isInstructor, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to the protected Instructor Portal!",
    });
});

export default router;
