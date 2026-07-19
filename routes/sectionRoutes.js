import express from "express";
import upload from "../config/multer.js";
import { FILE_FIELDS } from "../config/constants.js";
import { auth, isInstructor } from "../middlewares/auth.js";
import {uploadVideo,} from "../middlewares/uploadMiddleware.js";

import { createSection, updateSection, deleteSection, createSubsection, updateSubsection, deleteSubsection, reorderSections, reorderSubsections, uploadLectureVideoController, deleteLectureVideoController
} from "../controllers/sectionController.js";

const router = express.Router();

// Section Routes

router.post( "/create-section", auth, isInstructor, createSection);
router.put( "/update-section", auth, isInstructor, updateSection);
router.delete( "/delete-section/:sectionId", auth, isInstructor, deleteSection);
router.put( "/reorder-sections", auth, isInstructor, reorderSections);

// Subsection Routes

router.post( "/create-subsection", auth, isInstructor, createSubsection);
router.put( "/update-subsection", auth, isInstructor, upload.single(FILE_FIELDS.LECTURE_VIDEO), updateSubsection);
router.delete( "/delete-subsection/:subSectionId", auth, isInstructor, deleteSubsection);
router.put( "/reorder-subsections", auth, isInstructor, reorderSubsections); 
router.patch("/upload-video",auth,isInstructor,uploadVideo.single(FILE_FIELDS.LECTURE_VIDEO),uploadLectureVideoController);
router.delete( "/lecture-video/:subSectionId", auth, isInstructor, deleteLectureVideoController);


export default router;