import Course from "../models/course.js";
import RatingAndReview from "../models/ratingAndReview.js";
import CourseProgress from "../models/courseProgress.js";

import AppError from "./AppError.js";

import {
  getTotalVideosInCourse,
  calculateCourseCompletion,
} from "./progressHelper.js";

import {
  MINIMUM_PROGRESS_FOR_REVIEW,
} from "../config/constants.js";

// Check Existing Review

export const checkExistingReview = async (
  studentId,
  courseId
) => {
  const review = await RatingAndReview.findOne({
    user: studentId,
    course: courseId,
  });

  if (review) {
    throw new AppError(
      "You have already reviewed this course",
      409
    );
  }

  return true;
};

// Check Minimum Progress Before Review

export const checkMinimumProgressForReview = async (
  studentId,
  courseId
) => {
  const progress = await CourseProgress.findOne({
    user: studentId,
    courseId,
  });

  if (!progress) {
    throw new AppError(
      `Complete at least ${MINIMUM_PROGRESS_FOR_REVIEW}% of the course before reviewing`,
      403
    );
  }

  const totalVideos = await getTotalVideosInCourse(
    courseId
  );

  const completionPercentage =
    calculateCourseCompletion(
      progress.completedVideos.length,
      totalVideos
    );

  if (
    completionPercentage <
    MINIMUM_PROGRESS_FOR_REVIEW
  ) {
    throw new AppError(
      `Complete at least ${MINIMUM_PROGRESS_FOR_REVIEW}% of the course before reviewing`,
      403
    );
  }

  return true;
};



// Update Course Average Rating

export const updateCourseAverageRating = async (
  courseId
) => {
  const result = await RatingAndReview.aggregate([
    {
      $match: {
        course: courseId,
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

  const averageRating =
    result.length > 0
      ? Number(result[0].averageRating.toFixed(2))
      : 0;

  await Course.findByIdAndUpdate(courseId, {
    averageRating,
  });

  return averageRating;
};


// Update Course Rating Statistics

export const updateCourseRatingStats = async (
  courseId
) => {
  const result = await RatingAndReview.aggregate([
    {
      $match: {
        course: courseId,
      },
    },
    {
      $group: {
        _id: "$course",
        averageRating: {
          $avg: "$rating",
        },
        totalRatings: {
          $sum: 1,
        },
      },
    },
  ]);

  const averageRating =
    result.length > 0
      ? Number(result[0].averageRating.toFixed(2))
      : 0;

  const totalRatings =
    result.length > 0
      ? result[0].totalRatings
      : 0;

  await Course.findByIdAndUpdate(courseId, {
    averageRating,
    totalRatings,
  });

  return {
    averageRating,
    totalRatings,
  };
};

// Get Student Review For a Course

export const getStudentReviewForCourse = async (
  studentId,
  courseId,
  populate = false
) => {
  let query = RatingAndReview.findOne({
    user: studentId,
    course: courseId,
  });

  if (populate) {
    query = query
      .populate("user", "firstName lastName profileImage")
      .populate("course", "courseName thumbnail");
  }

  return await query;
};

