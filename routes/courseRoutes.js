import express from "express";
import { createCourse, getAllCourses } from "../controllers/courseController.js";
import { createSection, createSubsection } from "../controllers/sectionController.js";
import { auth, isInstructor } from "../middlewares/auth.js";

const router = express.Router();

// =========================================================================
// PUBLIC MARKETPLACE ROUTES (Anyone can view)
// =========================================================================

// Route to get a list of all available courses for students to buy
router.get("/show-all-courses", getAllCourses);


// =========================================================================
// PROTECTED CURRICULUM ROUTES (Instructors Only)
// =========================================================================

// Route to initialize a brand-new course shell
router.post("/create-course", auth, isInstructor, createCourse);

// Route to add a main chapter/section to a specific course
router.post("/add-section", auth, isInstructor, createSection);

// Route to upload a video lecture/subsection into a specific section
router.post("/add-subsection", auth, isInstructor, createSubsection);

export default router;
