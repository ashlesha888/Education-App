import express from "express";
import {
  updateProfile,
  deleteAccount,
  getUserDetails, updateProfilePicture,getPublicInstructorProfile,
  deleteProfileImageController
} from "../controllers/profileController.js";
import { auth } from "../middlewares/auth.js";
import {
  uploadProfileImageController,
} from "../controllers/profileController.js";

import {
  uploadImage,
} from "../middlewares/uploadMiddleware.js";

import {
  FILE_FIELDS,
} from "../config/constants.js";

const router = express.Router();

router.put("/update-profile", auth, updateProfile);

router.delete("/delete-profile", auth, deleteAccount);

router.get("/user-details", auth, getUserDetails);

import upload from "../config/multer.js";

router.put(
  "/update-profile-picture",
  auth,
  upload.single("image"),
  updateProfilePicture
);
router.patch(

  "/upload-profile-image",

  auth,

  uploadImage.single(
    FILE_FIELDS.PROFILE_IMAGE
  ),

  uploadProfileImageController

);
router.post("/public-instructor", getPublicInstructorProfile);
router.delete(

"/profile-image/:profileId",

auth,

deleteProfileImageController

);
router.patch(
  "/notification-preferences",
  auth,
  updateNotificationPreferencesController
);

export default router;