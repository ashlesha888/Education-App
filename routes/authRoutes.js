import express from "express";
import { sendOTP, signUp, login, logout, forgotPassword, resetPassword, changePassword } from "../controllers/authController.js";
import { auth, isStudent, isInstructor, isAdmin } from "../middlewares/auth.js";
import {
  emailValidation,
  passwordValidation,
} from "../validators/authValidator.js";

import {
  validateRequest,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post(
  "/send-otp",
  emailValidation,
  validateRequest,
  sendOTP
);
router.post("/signup", emailValidation, passwordValidation, validateRequest, signUp);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", auth, changePassword);

export default router;