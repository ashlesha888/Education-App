import express from "express";
import {
  createRating,
  getAverageRating,
} from "../controllers/ratingAndReviewController.js";
import { auth, isStudent } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-rating", auth, isStudent, createRating);

router.get("/get-average-rating", getAverageRating);

export default router;