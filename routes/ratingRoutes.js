import express from "express";
import { createRating, getAverageRating } from "../controllers/ratingAndReviewController.js";
import { auth, isStudent } from "../middlewares/auth.js";

const router = express.Router();

// Route to submit a review (Locked down to enrolled Students)
router.post("/create-rating", auth, isStudent, createRating);

// Route to fetch average rating score (Publicly accessible for the marketplace storefront)
router.get("/get-average-rating", getAverageRating);

export default router;
