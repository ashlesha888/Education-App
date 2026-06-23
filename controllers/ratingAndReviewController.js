import RatingAndReview from "../models/ratingAndReview.js";
import Course from "../models/course.js";
import mongoose from "mongoose";

// ==========================================
// 1. CREATE A RATING AND REVIEW
// ==========================================
export const createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        // Check if the user is actually enrolled in the course before letting them review it
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in this course or course does not exist",
            });
        }

        // Check if the user has already reviewed this specific course
        const alreadyReviewed = await RatingAndReview.findOne({ user: userId, course: courseId });
        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "You have already submitted feedback for this course",
            });
        }

        // Create the review document
        const newRatingReview = await RatingAndReview.create({
            user: userId,
            rating,
            review,
            course: courseId,
        });

        // Link the review ID into the parent Course record array
        await Course.findByIdAndUpdate(
            courseId,
            { $push: { ratingAndReviews: newRatingReview._id } },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: "Rating and review submitted successfully",
            data: newRatingReview,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. GET AVERAGE RATING FOR A COURSE
// ==========================================
export const getAverageRating = async (req, res) => {
    try {
        const { courseId } = req.body;

        // Use Mongo aggregation pipeline to calculate the mathematical average
        const result = await RatingAndReview.aggregate([
            {
                $match: { course: new mongoose.Types.ObjectId(courseId) }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ]);

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // If no reviews exist yet, return a default score of 0
        return res.status(200).json({
            success: true,
            averageRating: 0,
            message: "No ratings given for this course yet",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
