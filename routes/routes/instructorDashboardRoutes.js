
import express from "express";

import { auth, isInstructor } from "../middlewares/auth.js";

import {
  getInstructorDashboard,
  getInstructorCourses,
  getCourseStatistics,
  getStudentCount,
  getRevenue,
  getAverageRatings,
  getDashboardSummary,
  getRecentEnrollments,
  getTopPerformingCourses,
  getMonthlyRevenue,
  getMonthlyEnrollments,
  getCourseCompletionStatistics,
} from "../controllers/instructorDashboardController.js";

const router = express.Router();

router.use(auth, isInstructor);

router.get("/dashboard", getInstructorDashboard);

router.get("/courses", getInstructorCourses);

router.get("/course-statistics", getCourseStatistics);

router.get("/student-count", getStudentCount);

router.get("/revenue", getRevenue);

router.get("/average-ratings", getAverageRatings);

router.get("/summary", getDashboardSummary);

router.get("/recent-enrollments", getRecentEnrollments);

router.get("/top-courses", getTopPerformingCourses);

router.get("/monthly-revenue", getMonthlyRevenue);

router.get("/monthly-enrollments", getMonthlyEnrollments);

router.get(
  "/course-completion-statistics",
  getCourseCompletionStatistics
);

export default router;

