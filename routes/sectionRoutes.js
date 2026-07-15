import express from "express";
import {
  deleteLectureVideoController,
} from "../controllers/studentDashboardControllers.js";
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
import {
uploadLectureVideoController,
} from "../controllers/SectionController.js";
import { FILE_FIELDS } from "../config/constants.js";
import {
uploadVideo,
} from "../middlewares/uploadMiddleware.js";
import { auth, isInstructor } from "../middlewares/auth.js";
import upload from "../config/multer.js";

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

router.patch(

"/upload-video",

auth,

isInstructor,

uploadVideo.single(
FILE_FIELDS.LECTURE_VIDEO
),

uploadLectureVideoController

);

router.delete(
  "/lecture-video/:subSectionId",
  auth,
  isInstructor,
  deleteLectureVideoController
);


export default router;