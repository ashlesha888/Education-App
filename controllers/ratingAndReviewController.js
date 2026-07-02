
import RatingAndReview from "../models/ratingAndReviewModel.js";
import Course from "../models/courseModel.js";
import { validateCourse } from "../utils/progressHelper.js";
import {
    checkExistingReview,
    checkMinimumProgressForReview,
    updateCourseAverageRating,
} from "../utils/ratingHelper.js";

import {
    checkExistingReview,
    checkMinimumProgressForReview,
} from "../utils/ratingHelper.js";

export const createRating = async (req, res) => {
    try {
        const { courseId, rating, review } = req.body;
        const studentId = req.user.id;

        // Validate Request Body

        if (!courseId || rating === undefined || !review) {
            return res.status(400).json({
                success: false,
                message: "Course ID, rating and review are required",
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        // Validate Student

        const student = await validateStudent(studentId);

        // Validate Course

        const course = await validateCourse(courseId);

        // Check Enrollment

        validateEnrollment(student, courseId);

        // Check Minimum Progress (20%)

        await checkMinimumProgressForReview(
            studentId,
            courseId
        );

        // Prevent Duplicate Review

        await checkExistingReview(
            studentId,
            courseId
        );

        // Create Review

        const createdReview =
            await RatingAndReview.create({
                user: studentId,
                course: courseId,
                rating,
                review,
            });

        // Update Course

        course.ratingAndReviews.push(createdReview._id);

        await course.save();

        // Update average rating
        await updateCourseAverageRating(courseId);

        // Populate Created Review

        const populatedReview =
            await RatingAndReview.findById(
                createdReview._id
            )
                .populate({
                    path: "user",
                    select:
                        "firstName lastName profileImage",
                })
                .populate({
                    path: "course",
                    select:
                        "courseName thumbnail averageRating",
                });

        // Success Response

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: populatedReview,
        });

    } catch (error) {
        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Internal Server Error",
        });
    }
};


export const getAverageRating = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await validateCourse(courseId);

        return res.status(200).json({
            success: true,
            averageRating: course.averageRating,
            message: "Average rating fetched successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};


import RatingAndReview from "../models/ratingAndReviewModel.js";
import { validateCourse } from "../utils/progressHelper.js";

export const getAllReviewsForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // ==========================
        // Pagination
        // ==========================
        // ==========================
        // Sorting
        // ==========================

        const sort = req.query.sort || "latest";

        let sortOption = {};

        switch (sort) {
            case "latest":
                sortOption = { createdAt: -1 };
                break;

            case "oldest":
                sortOption = { createdAt: 1 };
                break;

            case "highest":
                sortOption = { rating: -1 };
                break;

            case "lowest":
                sortOption = { rating: 1 };
                break;

            default:
                sortOption = { createdAt: -1 };
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        // ==========================
        // Validate Course
        // ==========================

        await validateCourse(courseId);
        // ==========================
        // Rating Filter
        // ==========================

        const rating = Number(req.query.rating);

        const filter = {
            course: courseId,
        };

        if (rating >= 1 && rating <= 5) {
            filter.rating = rating;
        }
        // ==========================
        // Fetch Reviews
        // ==========================

        const reviews = await RatingAndReview.find(filter)
            .populate({
                path: "user",
                select: "firstName lastName profileImage",
            }).sort(sortOption)
            .skip(skip)
            .limit(limit);

        // ==========================
        // Total Reviews
        // ==========================

        const totalReviews =
            await RatingAndReview.countDocuments(filter);

        const totalPages = Math.ceil(
            totalReviews / limit
        );

        // ==========================
        // Response
        // ==========================

        return res.status(200).json({
            success: true,

            pagination: {
                currentPage: page,
                totalPages,
                totalReviews,
                limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },

            data: reviews,

            message: "Reviews fetched successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message ||
                "Internal Server Error",
        });
    }
};



