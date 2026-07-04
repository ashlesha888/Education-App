
import express from "express";

import {
  getStudentDashboard,
  getDashboardSummary,
  getPurchasedCourses,
  getContinueWatching,
  getRecentlyCompletedCourses,
  getLearningProgress,
  getTimeSpentLearning,
} from "../controllers/studentDashboardController.js";

import { auth } from "../middlewares/auth.js";
import { isStudent } from "../middlewares/studentMiddleware.js";

const router = express.Router();

router.use(auth, isStudent);

router.get(
  "/dashboard",
  getStudentDashboard
);

router.get(
  "/dashboard/summary",
  getDashboardSummary
);

router.get(
  "/dashboard/purchased-courses",
  getPurchasedCourses
);

router.get(
  "/dashboard/continue-watching",
  getContinueWatching
);

router.get(
  "/dashboard/recently-completed",
  getRecentlyCompletedCourses
);

router.get(
  "/dashboard/learning-progress",
  getLearningProgress
);

router.get(
  "/dashboard/time-spent",
  getTimeSpentLearning
);

export default router;

