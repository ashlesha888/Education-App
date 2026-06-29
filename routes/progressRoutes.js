import express from "express";
import { updateCourseProgress } from "../controllers/courseProgressController.js";
import { auth, isStudent } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/update-lesson-progress",
  auth,
  isStudent,
  updateCourseProgress
);

export default router;