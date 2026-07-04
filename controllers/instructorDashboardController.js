import {
    fetchInstructorCourses,
    calculateCourseRevenue,
    sortCourses,
    formatCourseDashboardData, getInstructorDashboardData,
    getRecentCourses,
    getTopCourses,
    getRecentEnrollmentsData,
} from "../utils/instructorDashboardHelper.js";


export const getInstructorDashboard =
    async (req, res) => {
        try {
            const instructorId = req.user.id;

            const {
                courses,
                statistics,
            } =
                await getInstructorDashboardData(
                    instructorId
                );

            const recentCourses =
                getRecentCourses(courses);

            const topCourses =
                getTopCourses(courses);

            return res.status(200).json({
                success: true,
                message:
                    "Instructor dashboard fetched successfully",

                data: {
                    ...statistics,

                    recentCourses,

                    topCourses,
                },
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




export const getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order || "desc";

        const courses = await fetchInstructorCourses(
            instructorId
        );

        const sortedCourses = sortCourses(
            courses,
            sortBy,
            order
        );

        const data =
            sortedCourses.map(
                formatCourseDashboardData
            );

        return res.status(200).json({
            success: true,
            message:
                "Instructor courses fetched successfully",
            count: data.length,
            data,
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



export const getCourseStatistics = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // 1. Read and parse the query parameters safely with defaults
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // 2. Pass them inside the options object to the orchestrator
    const { courseStatistics } = await getInstructorDashboardData(
      instructorId,
      {
        courseStatistics: true,
        page,   
        limit,  
      }
    );

    // 3. Return the paginated structure response
    return res.status(200).json({
      success: true,
      message: "Course statistics fetched successfully",
      pagination: courseStatistics.pagination, // Metadata (currentPage, totalPages, etc.)
      data: courseStatistics.statistics,       // The sliced items array
    });

  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};




export const getStudentCount = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const courses = await fetchInstructorCourses(
            instructorId
        );

        const totalStudents =
            calculateInstructorStudentCount(courses);

        const averageStudentsPerCourse =
            courses.length > 0
                ? Number(
                    (
                        totalStudents / courses.length
                    ).toFixed(1)
                )
                : 0;

        return res.status(200).json({
            success: true,
            message:
                "Student count fetched successfully",

            data: {
                totalCourses: courses.length,
                totalStudents,
                averageStudentsPerCourse,
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




export const getRevenue = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const courses = await fetchInstructorCourses(
            instructorId
        );

        const totalRevenue =
            calculateInstructorRevenue(courses);

        const averageRevenuePerCourse =
            courses.length > 0
                ? Number(
                    (
                        totalRevenue / courses.length
                    ).toFixed(2)
                )
                : 0;

        return res.status(200).json({
            success: true,
            message: "Revenue fetched successfully",

            data: {
                totalCourses: courses.length,
                totalRevenue,
                averageRevenuePerCourse,
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




export const getAverageRatings = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const courses = await fetchInstructorCourses(
            instructorId
        );

        const totalCourses = courses.length;

        const ratedCourses = courses.filter(
            (course) => course.totalRatings > 0
        );

        const overallAverageRating =
            ratedCourses.length > 0
                ? Number(
                    (
                        ratedCourses.reduce(
                            (sum, course) =>
                                sum + course.averageRating,
                            0
                        ) / ratedCourses.length
                    ).toFixed(2)
                )
                : 0;

        const highestRatedCourse =
            ratedCourses.length > 0
                ? ratedCourses.reduce((best, current) =>
                    current.averageRating >
                        best.averageRating
                        ? current
                        : best
                )
                : null;

        const lowestRatedCourse =
            ratedCourses.length > 0
                ? ratedCourses.reduce((worst, current) =>
                    current.averageRating <
                        worst.averageRating
                        ? current
                        : worst
                )
                : null;

        return res.status(200).json({
            success: true,
            message:
                "Average ratings fetched successfully",

            data: {
                totalCourses,

                ratedCourses: ratedCourses.length,

                unratedCourses:
                    totalCourses - ratedCourses.length,

                overallAverageRating,

                highestRatedCourse:
                    highestRatedCourse && {
                        courseId: highestRatedCourse._id,
                        courseName:
                            highestRatedCourse.courseName,
                        averageRating:
                            highestRatedCourse.averageRating,
                        totalRatings:
                            highestRatedCourse.totalRatings,
                    },

                lowestRatedCourse:
                    lowestRatedCourse && {
                        courseId: lowestRatedCourse._id,
                        courseName:
                            lowestRatedCourse.courseName,
                        averageRating:
                            lowestRatedCourse.averageRating,
                        totalRatings:
                            lowestRatedCourse.totalRatings,
                    },
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





export const getDashboardSummary = async (
    req,
    res
) => {
    try {
        const instructorId = req.user.id;

        const {
            courses,
            statistics,
        } =
            await getInstructorDashboardData(
                instructorId
            );

        const topCourse =
            getTopCourses(courses, 1)[0] || null;

        const recentCourse =
            getRecentCourses(courses, 1)[0] || null;

        return res.status(200).json({
            success: true,
            message:
                "Dashboard summary fetched successfully",

            data: {
                ...statistics,

                topCourse,

                recentCourse,
            },
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




export const getRecentEnrollments = async (
  req,
  res
) => {
  try {
    const instructorId = req.user.id;

    const limit =
      Number(req.query.limit) || 10;

    const { courses } =
      await getInstructorDashboardData(
        instructorId
      );

    const recentEnrollments =
      getRecentEnrollmentsData(
        courses,
        limit
      );

    return res.status(200).json({
      success: true,
      message:
        "Recent enrollments fetched successfully",
      count:
        recentEnrollments.length,
      data: recentEnrollments,
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




export const getTopPerformingCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const limit = Math.max(
            1,
            Math.min(10, Number(req.query.limit) || 5)
        );

        const sortBy = req.query.sortBy || "revenue";

        const order = req.query.order || "desc";

        const courses = await fetchInstructorCourses(
            instructorId
        );

        const sortedCourses = sortCourses(
            courses,
            sortBy,
            order
        ).slice(0, limit);

        const data =
            sortedCourses.map(
                formatCourseDashboardData
            );

        return res.status(200).json({
            success: true,
            message:
                "Top performing courses fetched successfully",

            count: data.length,

            data,
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




export const getMonthlyRevenue = async (
  req,
  res
) => {
  try {
    const instructorId = req.user.id;

    const {
      monthlyRevenue,
    } =
      await getInstructorDashboardData(
        instructorId,
        {
          monthlyRevenue: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Monthly revenue fetched successfully",

      count:
        monthlyRevenue.length,

      data: monthlyRevenue,
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




export const getMonthlyEnrollments = async (
  req,
  res
) => {
  try {
    const instructorId = req.user.id;

    const {
      monthlyEnrollments,
    } =
      await getInstructorDashboardData(
        instructorId,
        {
          monthlyEnrollments: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Monthly enrollments fetched successfully",

      count:
        monthlyEnrollments.length,

      data: monthlyEnrollments,
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




export const getCourseCompletionStatistics =
  async (req, res) => {
    try {
      const instructorId = req.user.id;

      const {
        completionStatistics,
      } =
        await getInstructorDashboardData(
          instructorId,
          {
            completionStatistics: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Course completion statistics fetched successfully",

        count:
          completionStatistics.length,

        data:
          completionStatistics,
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



