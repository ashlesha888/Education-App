import express from "express";
import { sendOTP, signUp, login, logout, forgotPassword, resetPassword, changePassword } from "../controllers/authController.js";
import { auth, isStudent, isInstructor, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", auth, changePassword);

router.get("/dashboard", auth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: `Welcome to your dashboard, ${req.user.email}!`,
  });
});

router.get("/student-portal", auth, isStudent, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the protected Student Portal!",
  });
});

router.get("/instructor-portal", auth, isInstructor, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the protected Instructor Portal!",
  });
});

router.get("/admin-portal", auth, isAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the protected Admin Portal!",
  });
});

export default router;