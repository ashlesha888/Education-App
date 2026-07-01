import express from "express";
import {
  createSection,
  updateSection,
  deleteSection,
  createSubsection,
  updateSubsection,
  deleteSubsection,
  reorderSections,
  reorderSubsections,
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

router.put(
  "/reorder-sections",
  auth,
  isInstructor,
  reorderSections
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


router.put(
  "/reorder-subsections",
  auth,
  isInstructor,
  reorderSubsections
); 

export default router;