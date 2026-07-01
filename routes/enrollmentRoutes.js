import express from "express";
import {
  enrollStudent,
  removeEnrollment,
  getEnrolledCourses,
  checkEnrollmentStatus,
  getCourseStudents,
} from "../controllers/enrollmentController.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();


// Student Enrollment

router.post("/enroll", auth, enrollStudent);

router.delete("/remove", auth, removeEnrollment);

router.get("/my-courses", auth, getEnrolledCourses);

router.get("/status/:courseId", auth, checkEnrollmentStatus);

// Instructor Side

router.get("/course-students/:courseId", auth, getCourseStudents);


export default router;