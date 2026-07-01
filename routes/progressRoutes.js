import express from "express";

import {
  updateCourseProgress,
  getCourseProgress,
  calculateCompletionPercentage,
  markCourseCompleted,
  resetCourseProgress,
  getLastWatchedLecture,
  getNextLecture,
  getLearningStatistics,
} from "../controllers/progressController.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Mark a lecture/subsection as completed
router.put(
  "/update-progress",
  auth,
  updateCourseProgress
);

// Get complete progress for a course
router.get(
  "/course/:courseId",
  auth,
  getCourseProgress
);

// Get completion percentage
router.get(
  "/completion/:courseId",
  auth,
  calculateCompletionPercentage
);

// Mark course completed
router.put(
  "/complete/:courseId",
  auth,
  markCourseCompleted
);

// Reset course progress
router.put(
  "/reset/:courseId",
  auth,
  resetCourseProgress
);

// Resume from last watched lecture
router.get(
  "/last-lecture/:courseId",
  auth,
  getLastWatchedLecture
);

// Get next lecture
router.get(
  "/next-lecture/:courseId",
  auth,
  getNextLecture
);

// Learning dashboard statistics
router.get(
  "/stats/:courseId",
  auth,
  getLearningStatistics
);

export default router;