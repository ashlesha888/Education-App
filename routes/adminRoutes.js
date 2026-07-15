import express from "express";
import { auth, isAdmin } from "../middlewares/auth.js";

import {
  getAllUsersController, deleteUserController, suspendUserController, restoreUserController, getUserByIdController, updateUserController, getAllCoursesController, getPendingCoursesController, publishCourseController, unpublishCourseController, deleteCourseController, getAllReviewsController, deleteReviewController, reportReviewController, getDashboardStatisticsController, getTotalRevenueController, getTotalUsersController, getTotalCoursesController, getTotalEnrollmentsController, getRecentRegistrationsController, getRecentPaymentsController, getMonthlyGrowthController, getMostActiveStudentsController, getTopInstructorsController, getTopRatedCoursesController,getPlatformOverviewController, healthCheckController, getDatabaseStatisticsController,  
} from "../controllers/adminController.js";

const router = express.Router();

// --- User Management ---
router.get("/users", auth, isAdmin, getAllUsersController);
router.get("/users/:userId", auth, isAdmin, getUserByIdController);
router.put("/users/:userId", auth, isAdmin, updateUserController);
router.delete("/users/:userId", auth, isAdmin, deleteUserController);
router.patch("/users/:userId/suspend", auth, isAdmin, suspendUserController);
router.patch("/users/:userId/restore", auth, isAdmin, restoreUserController);

// --- Course Management ---
router.get("/courses", auth, isAdmin, getAllCoursesController);
router.get("/courses/pending", auth, isAdmin, getPendingCoursesController);
router.patch("/courses/:courseId/publish", auth, isAdmin, publishCourseController);
router.patch("/courses/:courseId/unpublish", auth, isAdmin, unpublishCourseController);
router.delete("/courses/:courseId", auth, isAdmin, deleteCourseController);

// --- Review Management ---
router.get("/reviews", auth, isAdmin, getAllReviewsController);
router.delete("/reviews/:reviewId", auth, isAdmin, deleteReviewController);
router.patch("/reviews/:reviewId/report", auth, isAdmin, reportReviewController);

// --- Dashboard ---
router.get("/dashboard/statistics", auth, isAdmin, getDashboardStatisticsController);
router.get("/dashboard/revenue", auth, isAdmin, getTotalRevenueController);
router.get("/dashboard/users", auth, isAdmin, getTotalUsersController);
router.get("/dashboard/courses", auth, isAdmin, getTotalCoursesController);
router.get("/dashboard/enrollments", auth, isAdmin, getTotalEnrollmentsController);
router.get("/dashboard/recent-users", auth, isAdmin, getRecentRegistrationsController);
router.get(

  "/dashboard/recent-payments",

  auth,

  isAdmin,

  getRecentPaymentsController

);
router.get(
  "/dashboard/recent-payments",
  auth,
  isAdmin,
  getRecentPaymentsController
);

router.get(
  "/analytics/monthly-growth",
  auth,
  isAdmin,
  getMonthlyGrowthController
);

router.get(
  "/analytics/active-students",
  auth,
  isAdmin,
  getMostActiveStudentsController
);

router.get(
  "/analytics/top-instructors",
  auth,
  isAdmin,
  getTopInstructorsController
);

router.get(

  "/analytics/top-rated-courses",

  auth,

  isAdmin,

  getTopRatedCoursesController

);
router.get(

  "/overview",

  auth,

  isAdmin,

  getPlatformOverviewController

);
router.get(

  "/health",

  healthCheckController

);
router.get(

  "/database/statistics",

  auth,

  isAdmin,

  getDatabaseStatisticsController

);
export default router;
