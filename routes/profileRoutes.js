import express from "express";
import { updateProfile, deleteAccount, getUserDetails } from "../controllers/profileController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// ==========================================
// PROTECTED PROFILE ROUTES (Requires Login)
// ==========================================

// Route to update personal details (bio, gender, phone, DOB)
router.put("/update-profile", auth, updateProfile);

// Route to permanently close and delete the account
router.delete("/delete-profile", auth, deleteAccount);

// Route to fetch full user info including populated profile metadata
router.get("/user-details", auth, getUserDetails);

export default router;
