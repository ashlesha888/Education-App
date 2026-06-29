import mongoose from "mongoose";

import RatingAndReview from "../models/RatingAndReview.js";
import Course from "../models/Course.js";

export const createRating = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;
    const userId = req.user.id;

    if (!rating || !review || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Rating, review and course ID are required",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      studentsEnrolled: userId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or student is not enrolled",
      });
    }

    const existingReview = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    const newReview = await RatingAndReview.create({
      user: userId,
      rating,
      review,
      course: courseId,
    });

    await Course.findByIdAndUpdate(courseId, {
      $push: {
        ratingAndReviews: newReview._id,
      },
    });

    return res.status(201).json({
      success: true,
      data: newReview,
      message: "Rating and review added successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create rating and review",
    });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: "$course",
          averageRating: {
            $avg: "$rating",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      averageRating: result.length ? result[0].averageRating : 0,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch average rating",
    });
  }
};