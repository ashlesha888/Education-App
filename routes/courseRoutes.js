import express from "express";
import { createCourse, getAllCourses } from "../controllers/courseController.js";
import { createSection, createSubsection } from "../controllers/sectionController.js";
import { auth, isInstructor } from "../middlewares/auth.js";

const router = express.Router();

router.get("/show-all-courses", getAllCourses);

router.post("/create-course", auth, isInstructor, createCourse);

router.post("/add-section", auth, isInstructor, createSection);

router.post("/add-subsection", auth, isInstructor, createSubsection);

export default router;