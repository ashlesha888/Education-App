import express from "express";
import { updateCourseProgress } from "../controllers/courseProgressController.js";
import { auth, isStudent } from "../middlewares/auth.js";

const router = express.Router();

// =========================================================================
// PROTECTED PROGRESS ROUTES (Students Only)
// =========================================================================

// Route to mark a video lesson/subsection as completed
router.post("/update-lesson-progress", auth, isStudent, updateCourseProgress);

export default router;
