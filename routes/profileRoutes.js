import express from "express";
import {
  updateProfile,
  deleteAccount,
  getUserDetails,
} from "../controllers/profileController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.put("/update-profile", auth, updateProfile);

router.delete("/delete-profile", auth, deleteAccount);

router.get("/user-details", auth, getUserDetails);

export default router;