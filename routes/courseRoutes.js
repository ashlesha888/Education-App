import express from "express";
import {
  createCourse,
  getAllCourses,
  updateCourseThumbnail,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateCourseStatus,
  filterCoursesByCategory,
  searchCourses,
  getCoursesByInstructor,
} from "../controllers/courseController.js";

import upload from "../middlewares/multer.js";
import {
  createSection,
  createSubsection,
  updateSection,
} from "../controllers/sectionController.js";
import { auth, isInstructor } from "../middlewares/auth.js";

const router = express.Router();

// Course CRUD

router.post("/create-course", auth, isInstructor, createCourse);

router.put(
  "/update-thumbnail",
  auth,
  isInstructor,
  upload.single("image"),
  updateCourseThumbnail
);

router.put("/update-course", auth, isInstructor, updateCourse);

router.delete("/delete-course", auth, isInstructor, deleteCourse);

router.put(
  "/update-course-status",
  auth,
  isInstructor,
  updateCourseStatus
);

// Sections

router.post("/add-section", auth, isInstructor, createSection);
router.put("/update-section", auth, isInstructor, updateSection);
router.post("/add-subsection", auth, isInstructor, createSubsection);

// Course Queries

router.get("/show-all-courses", getAllCourses);

router.get("/search", searchCourses);

router.get("/category/:categoryId", filterCoursesByCategory);

router.get("/instructor/:instructorId", getCoursesByInstructor);

// LAST
router.get("/:courseId", getCourseById);

export default router;