import { getAllUsers, getUserById, updateUser, deleteUser, suspendUser, restoreUser, getPendingCourses, publishCourse, unpublishCourse, deleteCourse, getAllReviews, deleteReview, reportReview, getDashboardStatistics, getTotalRevenue, getTotalUsers, getTotalCourses, getTotalEnrollments, getRecentRegistrations, getRecentPayments, getMonthlyGrowth, getMostActiveStudents, getTopInstructors, getPlatformOverview, getTopRatedCourses,  getHealthStatus,  getDatabaseStatistics,
} from "../utils/adminHelper.js";


export const getAllUsersController =
async (
  req,
  res,
  next
) => {

  try {

    const users =
      await getAllUsers();

    return res.status(200).json({

      success: true,

      count: users.length,

      data: users,

    });

  } catch (error) {

    next(error);

  }

};
export const getUserByIdController =
async (
  req,
  res,
  next
) => {

  try {

    const user =
      await getUserById(
        req.params.userId
      );

    return res.status(200).json({

      success: true,

      data: user,

    });

  } catch (error) {

    next(error);

  }

};
export const updateUserController =
async (
  req,
  res,
  next
) => {

  try {

    const user =
      await updateUser(

        req.params.userId,

        req.body

      );

    return res.status(200).json({

      success: true,

      message:
        "User updated successfully.",

      data: user,

    });

  } catch (error) {

    next(error);

  }

};
export const deleteUserController =
async (
  req,
  res,
  next
) => {

  try {

    await deleteUser(
      req.params.userId
    );

    return res.status(200).json({

      success: true,

      message:
        "User deleted successfully.",

    });

  } catch (error) {

    next(error);

  }

};
export const suspendUserController =
async (
  req,
  res,
  next
) => {

  try {

    const user =
      await suspendUser(
        req.params.userId
      );

    return res.status(200).json({

      success: true,

      message:
        "User suspended successfully.",

      data: user,

    });

  } catch (error) {

    next(error);

  }

};
export const restoreUserController =
async (
  req,
  res,
  next
) => {

  try {

    const user =
      await restoreUser(
        req.params.userId
      );

    return res.status(200).json({

      success: true,

      message:
        "User restored successfully.",

      data: user,

    });

  } catch (error) {

    next(error);

  }

};
export const getAllCoursesController =
async (
  req,
  res,
  next
) => {

  try {

    const courses =
      await getAllCourses();

    return res.status(200).json({

      success: true,

      count: courses.length,

      data: courses,

    });

  } catch (error) {

    next(error);

  }

};
export const getPendingCoursesController =
async (
  req,
  res,
  next
) => {

  try {

    const courses =
      await getPendingCourses();

    return res.status(200).json({

      success: true,

      count: courses.length,

      data: courses,

    });

  } catch (error) {

    next(error);

  }

};
export const publishCourseController =
async (
  req,
  res,
  next
) => {

  try {

    const course =
      await publishCourse(

        req.params.courseId

      );

    return res.status(200).json({

      success: true,

      message:
        "Course published successfully.",

      data: course,

    });

  } catch (error) {

    next(error);

  }

};
export const unpublishCourseController =
async (
  req,
  res,
  next
) => {

  try {

    const course =
      await unpublishCourse(
        req.params.courseId
      );

    return res.status(200).json({

      success: true,

      message:
        "Course unpublished successfully.",

      data: course,

    });

  } catch (error) {

    next(error);

  }

};
export const deleteCourseController =
async (
  req,
  res,
  next
) => {

  try {

    await deleteCourse(
      req.params.courseId
    );

    return res.status(200).json({

      success: true,

      message:
        "Course deleted successfully.",

    });

  } catch (error) {

    next(error);

  }

};
export const getAllReviewsController =
async (
  req,
  res,
  next
) => {

  try {

    const reviews =
      await getAllReviews();

    return res.status(200).json({

      success: true,

      count: reviews.length,

      data: reviews,

    });

  } catch (error) {

    next(error);

  }

};
export const deleteReviewController =
async (
  req,
  res,
  next
) => {

  try {

    await deleteReview(
      req.params.reviewId
    );

    return res.status(200).json({

      success: true,

      message:
        "Review deleted successfully.",

    });

  } catch (error) {

    next(error);

  }

};
export const reportReviewController =
async (
  req,
  res,
  next
) => {

  try {

    const review =
      await reportReview(
        req.params.reviewId
      );

    return res.status(200).json({

      success: true,

      message:
        "Review reported successfully.",

      data: review,

    });

  } catch (error) {

    next(error);

  }

};
export const getDashboardStatisticsController =
async (
  req,
  res,
  next
) => {

  try {

    const statistics =
      await getDashboardStatistics();

    return res.status(200).json({

      success: true,

      data: statistics,

    });

  } catch (error) {

    next(error);

  }

};
export const getTotalRevenueController =
async (
  req,
  res,
  next
) => {

  try {

    const revenue =
      await getTotalRevenue();

    return res.status(200).json({

      success: true,

      totalRevenue:
        revenue,

    });

  } catch (error) {

    next(error);

  }

};
export const getTotalUsersController =
async (
  req,
  res,
  next
) => {

  try {

    const totalUsers =
      await getTotalUsers();

    return res.status(200).json({

      success: true,

      totalUsers,

    });

  } catch (error) {

    next(error);

  }

};
export const getTotalCoursesController =
async (
  req,
  res,
  next
) => {

  try {

    const totalCourses =
      await getTotalCourses();

    return res.status(200).json({

      success: true,

      totalCourses,

    });

  } catch (error) {

    next(error);

  }

};
export const getTotalEnrollmentsController =
async (
  req,
  res,
  next
) => {

  try {

    const totalEnrollments =
      await getTotalEnrollments();

    return res.status(200).json({

      success: true,

      totalEnrollments,

    });

  } catch (error) {

    next(error);

  }

};
export const getRecentRegistrationsController =
async (
  req,
  res,
  next
) => {

  try {

    const users =
      await getRecentRegistrations();

    return res.status(200).json({

      success: true,

      count: users.length,

      data: users,

    });

  } catch (error) {

    next(error);

  }

};
export const getRecentPaymentsController =
async (
  req,
  res,
  next
) => {

  try {

    const payments =
      await getRecentPayments();

    return res.status(200).json({

      success: true,

      count: payments.length,

      data: payments,

    });

  } catch (error) {

    next(error);

  }

};
export const getMonthlyGrowthController =
async (
  req,
  res,
  next
) => {

  try {

    const growth =
      await getMonthlyGrowth();

    return res.status(200).json({

      success: true,

      data: growth,

    });

  } catch (error) {

    next(error);

  }

};
export const getMostActiveStudentsController =
async (
  req,
  res,
  next
) => {

  try {

    const students =
      await getMostActiveStudents();

    return res.status(200).json({

      success: true,

      count: students.length,

      data: students,

    });

  } catch (error) {

    next(error);

  }

};
export const getTopInstructorsController =
async (
  req,
  res,
  next
) => {

  try {

    const instructors =
      await getTopInstructors();

    return res.status(200).json({

      success: true,

      data: instructors,

    });

  } catch (error) {

    next(error);

  }

};
export const getTopRatedCoursesController =
async (
  req,
  res,
  next
) => {

  try {

    const courses =
      await getTopRatedCourses();

    return res.status(200).json({

      success: true,

      count: courses.length,

      data: courses,

    });

  } catch (error) {

    next(error);

  }

};
export const getPlatformOverviewController =
async (
  req,
  res,
  next
) => {

  try {

    const overview =
      await getPlatformOverview();

    return res.status(200).json({

      success: true,

      data: overview,

    });

  } catch (error) {

    next(error);

  }

};
export const healthCheckController =
async (
  req,
  res,
  next
) => {

  try {

    const health =
      await getHealthStatus();

    return res.status(200).json({

      success: true,

      data: health,

    });

  } catch (error) {

    next(error);

  }

};
export const getDatabaseStatisticsController =
async (
  req,
  res,
  next
) => {

  try {

    const statistics =
      await getDatabaseStatistics();

    return res.status(200).json({

      success: true,

      data: statistics,

    });

  } catch (error) {

    next(error);

  }

};