import express from "express";
import upload from "../config/multer.js";

import { FILE_FIELDS } from "../config/constants.js";
import { uploadImage,} from "../middlewares/uploadMiddleware.js";
import { auth, isInstructor } from "../middlewares/auth.js";

import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, updateCourseStatus, filterCoursesByCategory, searchCourses, getCoursesByInstructor, uploadCourseThumbnailController, deleteCourseThumbnailController,} from "../controllers/courseController.js";

const router = express.Router();

// Course CRUD

router.post("/create-course", auth, isInstructor, createCourse);
router.put("/update-course", auth, isInstructor, updateCourse);
router.delete("/delete-course/:courseId", auth, isInstructor, deleteCourse);
router.put( "/update-course-status", auth, isInstructor, updateCourseStatus);

// Course Queries

router.get("/show-all-courses", getAllCourses);
router.get("/search", searchCourses);

//router.get("/category/:categoryId", filterCoursesByCategory);

router.get("/instructor/:instructorId", getCoursesByInstructor);
router.post( "/upload-course-thumbnail", auth, isInstructor, uploadImage.single( FILE_FIELDS.COURSE_THUMBNAIL), uploadCourseThumbnailController);
router.delete( "/thumbnail/:courseId", auth, deleteCourseThumbnailController);

// LAST
router.get("/:courseId", getCourseById);

export default router;