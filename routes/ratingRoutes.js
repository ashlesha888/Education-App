
import express from "express";

import {
  createRating,
  getAverageRating,
  getAllReviewsForCourse,
  getTopRatedCourses,
  deleteReview,
  updateReview,
  getStudentReview,
  checkCanReview,
  getRecentReviews,
  getRatingDistribution,
} from "../controllers/ratingController.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Create Rating
router.post("/create", auth, createRating);

// Average Rating
router.get("/average/:courseId", getAverageRating);

// All Reviews of a Course
router.get("/course/:courseId", getAllReviewsForCourse);

// Top Rated Courses
router.get("/top-rated", getTopRatedCourses);

// Delete Review
router.delete("/:reviewId", auth, deleteReview);

// Update Review
router.put("/:reviewId", auth, updateReview);

// Student's Review for a Course
router.get(
  "/my-review/:courseId",
  auth,
  getStudentReview
);

// Can Student Review?
router.get(
  "/can-review/:courseId",
  auth,
  checkCanReview
);

// Recent Reviews
router.get("/recent", getRecentReviews);

// Rating Distribution
router.get(
  "/distribution/:courseId",
  getRatingDistribution
);

export default router;

