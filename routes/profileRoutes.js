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

import upload from "../middlewares/multer.js";

router.put(
  "/update-profile-picture",
  auth,
  upload.single("image"),
  updateProfilePicture
);

router.post("/public-instructor", getPublicInstructorProfile);

export default router;