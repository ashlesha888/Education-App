import User from "../models/user.js";
import Profile from "../models/profile.js";
import Course from "../models/course.js";
import Section from "../models/section.js";
import SubSection from "../models/subSection.js";
import RatingAndReview from "../models/ratingAndReview.js";
import Payment from "../models/payment.js"; 

import { deleteUploadedFile } from "./cloudinaryHelper.js";
import { RESOURCE_TYPES, COURSE_STATUS, PAYMENT_STATUS } from "../config/constants.js"; 

/**
 * Get All Users
 */
export const getAllUsers = async () => {
  return await User.find()
    .populate("profile")
    .select("-password")
    .sort({ createdAt: -1 });
};

/**
 * Get User By ID
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .populate("profile")
    .select("-password");

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Update User
 */
export const updateUser = async (userId, updates) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(user, updates);
  await user.save();
  return user;
};

/**
 * Delete User
 */
export const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (user.profile) {
    await Profile.findByIdAndDelete(user.profile);
  }

  await Course.updateMany(
    {},
    {
      $pull: { studentsEnrolled: user._id },
    }
  );

  await User.findByIdAndDelete(userId);
  return true;
};

/**
 * Suspend User
 */
export const suspendUser = async (userId) => {
  const user = await getUserById(userId);
  user.isSuspended = true;
  user.suspendedAt = new Date();
  await user.save();
  return user;
};

/**
 * Restore User
 */
export const restoreUser = async (userId) => {
  const user = await getUserById(userId);
  user.isSuspended = false;
  user.suspendedAt = null;
  await user.save();
  return user;
};

/**
 * Get Pending Courses
 */
export const getPendingCourses = async () => {
  return await Course.find({ status: "Draft" })
    .populate("instructor", "firstName lastName")
    .populate("tag", "name")
    .sort({ createdAt: -1 });
};

/**
 * Publish Course
 */
export const publishCourse = async (courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
   throw new NotFoundError(
  "Course not found."
);
  }

  course.status = COURSE_STATUS.PUBLISHED;
  await course.save();
  return course;
};

/**
 * Unpublish Course
 */
export const unpublishCourse = async (courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
  throw new NotFoundError(
  "Course not found."
);
  }

  course.status = COURSE_STATUS.DRAFT;
  await course.save();
  return course;
};

/**
 * Delete Course
 */
export const deleteCourse = async (courseId) => {
  const course = await Course.findById(courseId).populate({

path:"courseContent",

select:"sectionName subSections",

populate:{

path:"subSections",

select:

"title timeDuration video",

},

});;

  if (!course) {
throw new NotFoundError(
  "Course not found."
);
  }

  await User.updateMany(
    { courses: course._id },
    { $pull: { courses: course._id } }
  );

  if (course.thumbnail?.publicId) {
    await deleteUploadedFile({
      model: course,
      field: "thumbnail",
      resourceType: RESOURCE_TYPES.IMAGE,
    });
  }

  await RatingAndReview.deleteMany({ course: course._id });

  for (const section of course.courseContent) {
    if (section.subSections && section.subSections.length > 0) {
      await SubSection.deleteMany({
        _id: { $in: section.subSections },
      });
    }
    await Section.findByIdAndDelete(section._id);
  }

  await Course.findByIdAndDelete(course._id);
  return true;
};

/**
 * Get All Reviews
 */
export const getAllReviews = async () => {
  return await RatingAndReview.find()
    .populate("user", "firstName lastName")
    .populate("course", "courseName")
    .sort({ createdAt: -1 });
};

/**
 * Delete Review
 */
export const deleteReview = async (reviewId) => {
  const review = await RatingAndReview.findById(reviewId);

  if (!review) {
    const error = new Error("Review not found.");
    error.statusCode = 404;
    throw error;
  }

  await Course.findByIdAndUpdate(
    review.course,
    {
      $pull: { ratingAndReviews: review._id },
      $inc: { totalRatings: -1 },
    }
  );

  await RatingAndReview.findByIdAndDelete(reviewId);
  return true;
};

/**
 * Report Review
 */
export const reportReview = async (reviewId) => {
  const review = await RatingAndReview.findById(reviewId);

  if (!review) {
    const error = new Error("Review not found.");
    error.statusCode = 404;
    throw error;
  }

  review.isReported = true;
  review.reportedAt = new Date();
  await review.save();
  return review;
};

/**
 * Get Total Revenue
 */
export const getTotalRevenue = async () => {
  const revenue = await Payment.aggregate([
    {
      $match: { status: PAYMENT_STATUS.SUCCESS },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  return revenue[0]?.totalRevenue || 0;
};

/**
 * Get Total Users
 */
export const getTotalUsers = async () => {
  return await User.countDocuments();
};

/**
 * Get Total Courses
 */
export const getTotalCourses = async () => {
  return await Course.countDocuments();
};

/**
 * Get Total Enrollments
 */
export const getTotalEnrollments = async () => {
  const result = await Course.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$totalStudentsEnrolled" },
      },
    },
  ]);

  return result[0]?.total || 0;
};

/**
 * Dashboard Statistics
 */
export const getDashboardStatistics = async () => {
  const [totalRevenue, totalUsers, totalCourses, totalEnrollments] = await Promise.all([
    getTotalRevenue(),
    getTotalUsers(),
    getTotalCourses(),
    getTotalEnrollments(),
  ]);

  return {
    totalRevenue,
    totalUsers,
    totalCourses,
    totalEnrollments,
  };
};

/**
 * Recent Registrations
 */
export const getRecentRegistrations = async (limit = 10) => {
  return await User.find()
    .populate("profile")
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Recent Payments
 */
export const getRecentPayments = async (limit = 10) => {
  return await Payment.find()
    .populate("user", "firstName lastName email")
    .populate("course", "courseName")
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Monthly Growth
 */
export const getMonthlyGrowth = async () => {
  return await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        users: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);
};

/**
 * Most Active Students
 */
export const getMostActiveStudents = async (limit = 10) => {
  return await User.aggregate([
    {
      $match: { accountType: "Student" },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
        totalCourses: { $size: "$courses" },
      },
    },
    {
      $sort: { totalCourses: -1 },
    },
    {
      $limit: limit,
    },
  ]);
};

/**
 * Top Instructors
 */
export const getTopInstructors = async (limit = 10) => {
  return await Course.aggregate([
    {
      $group: {
        _id: "$instructor",
        totalCourses: { $sum: 1 },
        totalStudents: { $sum: "$totalStudentsEnrolled" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "instructorDetails",
      },
    },
    {
      $unwind: "$instructorDetails",
    },
    {
      $sort: { totalStudents: -1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        firstName: "$instructorDetails.firstName",
        lastName: "$instructorDetails.lastName",
        email: "$instructorDetails.email",
        totalCourses: 1,
        totalStudents: 1,
      },
    },
  ]);
};
/**
 * Top Rated Courses
 */
export const getTopRatedCourses =
async (
  limit = 10
) => {

  return await Course.find({

    status: COURSE_STATUS.PUBLISHED,

  })

  .populate(
    "instructor",
    "firstName lastName"
  )

  .sort({

    averageRating: -1,

    totalRatings: -1,

  })

  .limit(limit);

};
/**
 * Platform Overview
 */
export const getPlatformOverview =
async () => {

  const [

    statistics,

    recentUsers,

    recentPayments,

    topCourses,

    topInstructors,

  ] = await Promise.all([

    getDashboardStatistics(),

    getRecentRegistrations(5),

    getRecentPayments(5),

    getTopRatedCourses(5),

    getTopInstructors(5),

  ]);

  return {

    statistics,

    recentUsers,

    recentPayments,

    topCourses,

    topInstructors,

  };

};
import mongoose from "mongoose";

/**
 * Health Check
 */
export const getHealthStatus =
async () => {

  return {

    server: "Running",

    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",

    uptime:
      process.uptime(),

    timestamp:
      new Date(),

  };

};
/**
 * Database Statistics
 */
export const getDatabaseStatistics =
async () => {

  const stats =
    await mongoose.connection.db.stats();

  return {

    collections:
      stats.collections,

    documents:
      stats.objects,

    indexes:
      stats.indexes,

    dataSize:
      stats.dataSize,

    storageSize:
      stats.storageSize,

    avgObjectSize:
      stats.avgObjSize,

  };

};