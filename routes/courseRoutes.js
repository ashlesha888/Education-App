import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  updateCourseThumbnail,
  deleteCourse,
} from "../controllers/courseController.js";
import upload from "../middlewares/multer.js";
import { createSection, createSubsection } from "../controllers/sectionController.js";
import { auth, isInstructor } from "../middlewares/auth.js";

const router = express.Router();

router.get("/show-all-courses", getAllCourses);

router.post("/create-course", auth, isInstructor, createCourse);

router.post("/add-section", auth, isInstructor, createSection);

router.post("/add-subsection", auth, isInstructor, createSubsection);

router.put(
  "/update-thumbnail",
  auth,
  isInstructor,
  upload.single("image"),
  updateCourseThumbnail
);
router.put("/update-course", auth, isInstructor, updateCourse);
router.delete("/delete-course", auth, isInstructor, deleteCourse);
router.get("/:courseId", getCourseById);



export default router;