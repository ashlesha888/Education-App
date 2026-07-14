
import mongoose from "mongoose";

import { MINIMUM_RATINGS_FOR_TOP_COURSE } from "../config/constants.js";

import Course from "../models/course.js";
import RatingAndReview from "../models/ratingAndReview.js";

import AppError from "../utils/errors/AppError.js";

import {
  validateStudent,
  validateCourse,
  validateEnrollment,
} from "../utils/progressHelper.js";

import {
  checkExistingReview,
  checkMinimumProgressForReview,
  updateCourseAverageRating,
  updateCourseRatingStats,
  getStudentReviewForCourse,
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

export const getAllReviewsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;


    // Pagination


    // Sorting


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


    // Validate Course


    await validateCourse(courseId);

    // Rating Filter


    const rating = Number(req.query.rating);

    const filter = {
      course: courseId,
    };

    if (rating >= 1 && rating <= 5) {
      filter.rating = rating;
    }

    // Fetch Reviews


    const reviews = await RatingAndReview.find(filter)
      .populate({
        path: "user",
        select: "firstName lastName profileImage",
      }).sort(sortOption)
      .skip(skip)
      .limit(limit);


    // Total Reviews


    const totalReviews =
      await RatingAndReview.countDocuments(filter);

    const totalPages = Math.ceil(
      totalReviews / limit
    );


    // Response


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

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const studentId = req.user.id;

    // Validate Review ID

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    // Find Review

    const review = await RatingAndReview.findById(
      reviewId
    );

    if (!review) {
      throw new AppError(
        "Review not found",
        404
      );
    }

    // Authorization

    if (
      review.user.toString() !== studentId
    ) {
      throw new AppError(
        "You can delete only your own review",
        403
      );
    }

    // Remove Review From Course

    await Course.findByIdAndUpdate(
      review.course,
      {
        $pull: {
          ratingAndReviews: review._id,
        },
      }
    );

    // Delete Review

    await review.deleteOne();

    // Update Rating Statistics

    const stats =
      await updateCourseRatingStats(
        review.course
      );

    // Success Response

    return res.status(200).json({
      success: true,
      message:
        "Review deleted successfully",

      ratingStatistics: stats,
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


export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;
    const studentId = req.user.id;

    const existingReview = await RatingAndReview.findById(reviewId);

    if (!existingReview) {
      throw new AppError("Review not found", 404);
    }

    if (existingReview.user.toString() !== studentId) {
      throw new AppError(
        "You can update only your own review",
        403
      );
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      existingReview.rating = rating;
    }

    if (review !== undefined) {
      existingReview.review = review;
    }

    await existingReview.save();

    await updateCourseRatingStats(
      existingReview.course
    );

    const updatedReview =
      await RatingAndReview.findById(
        existingReview._id
      )
        .populate(
          "user",
          "firstName lastName profileImage"
        )
        .populate(
          "course",
          "courseName thumbnail"
        );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
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


export const getTopRatedCourses = async (req, res) => {
  try {
    const limit =
      Number(req.query.limit) || 10;

    const courses = await Course.find({
      status: "Published",
      totalRatings: {
        $gte: MINIMUM_RATINGS_FOR_TOP_COURSE,
      },
    }).sort({
      averageRating: -1,
      totalRatings: -1,
    })
      .limit(limit)
      .populate(
        "instructor",
        "firstName lastName profileImage"
      )
      .populate(
        "tag",
        "name"
      );

    return res.status(200).json({
      success: true,
      totalCourses: courses.length,
      data: courses,
      message:
        "Top rated courses fetched successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
};


export const getStudentReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Validate Student

    await validateStudent(studentId);

    // Validate Course

    await validateCourse(courseId);

    // Get Student Review

    const review = await getStudentReviewForCourse(
      studentId,
      courseId
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found for this course",
      });
    }

    // Populate Review

    const populatedReview =
      await RatingAndReview.findById(review._id)
        .populate({
          path: "user",
          select: "firstName lastName profileImage",
        })
        .populate({
          path: "course",
          select: "courseName thumbnail averageRating",
        });

    // Success Response

    return res.status(200).json({
      success: true,
      message: "Student review fetched successfully",
      data: populatedReview,
    });

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Internal Server Error",
    });
  }
};

export const checkStudentCanReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Validate Student

    const student = await validateStudent(studentId);

    // Validate Course

    await validateCourse(courseId);

    // Check Enrollment

    validateEnrollment(student, courseId);

    // Check Minimum Progress

    const progress =
      await checkMinimumProgressForReview(
        studentId,
        courseId
      );

    // Check Existing Review

    const existingReview =
      await getStudentReviewForCourse(
        studentId,
        courseId
      );

    if (existingReview) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: "You have already reviewed this course.",
      });
    }

    // Eligible to Review

    return res.status(200).json({
      success: true,
      canReview: true,
      reason: null,

      requirements: {
        minimumProgressRequired:
          MINIMUM_PROGRESS_FOR_REVIEW,
      },

      progress: {
        completedVideos:
          progress.completedVideos.length,
        completionPercentage:
          progress.completionPercentage,
      },

      message: "Student is eligible to review this course.",
    });
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      canReview: false,

      requirements: {
        minimumProgressRequired:
          MINIMUM_PROGRESS_FOR_REVIEW,
      },

      reason: error.message || "Internal Server Error",
    });
  }
};



export const getRecentReviews = async (req, res) => {
  try {
    // Pagination
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(req.query.limit) || 10)
    );
    const skip = (page - 1) * limit;

    // Fetch Reviews
    const reviews = await RatingAndReview.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user",
        select: "firstName lastName profileImage",
      })
      .populate({
        path: "course",
        select:
          "courseName thumbnail averageRating totalRatings",
      })
      .lean();

    // Total Reviews
    const totalReviews =
      await RatingAndReview.countDocuments();

    const totalPages = Math.ceil(
      totalReviews / limit
    );

    return res.status(200).json({
      success: true,
      message: "Recent reviews fetched successfully",

      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      data: reviews,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
};



export const getRatingDistribution = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await validateCourse(courseId);

    const distribution =
      await getCourseRatingDistribution(
        course._id
      );

    return res.status(200).json({
      success: true,
      message: "Rating distribution fetched successfully",

      data: {
        courseId: course._id,
        courseName: course.courseName,
        averageRating: course.averageRating,
        totalRatings: course.totalRatings,
        distribution,
      },
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




export const getCourseRatingSummary = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await validateCourse(courseId);

    const distribution =
      await getCourseRatingDistribution(
        course._id
      );

    const totalRatings = course.totalRatings || 0;

    const breakdown = {};

    Object.entries(distribution).forEach(
      ([star, count]) => {
        breakdown[star] = {
          count,
          percentage:
            totalRatings > 0
              ? Number(
                  (
                    (count / totalRatings) *
                    100
                  ).toFixed(1)
                )
              : 0,
        };
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Course rating summary fetched successfully",

      data: {
        courseId: course._id,
        courseName: course.courseName,
        averageRating: course.averageRating,
        totalRatings: course.totalRatings,
        breakdown,
      },
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

