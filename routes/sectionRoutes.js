import express from "express";
import {
  createSection,
  updateSection,
  deleteSection,
  createSubsection,
  updateSubsection,
  deleteSubsection,
} from "../controllers/sectionController.js";

import { auth, isInstructor } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Section Routes

router.post(
  "/create-section",
  auth,
  isInstructor,
  createSection
);

router.put(
  "/update-section",
  auth,
  isInstructor,
  updateSection
);

router.delete(
  "/delete-section",
  auth,
  isInstructor,
  deleteSection
);

// Subsection Routes

router.post(
  "/create-subsection",
  auth,
  isInstructor,
  createSubsection
);

router.put(
  "/update-subsection",
  auth,
  isInstructor,
  upload.single("video"),
  updateSubsection
);

router.delete(
  "/delete-subsection",
  auth,
  isInstructor,
  deleteSubsection
);

export default router;