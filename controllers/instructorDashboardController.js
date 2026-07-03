import {
  getInstructorCourses,
  calculateInstructorRevenue,
} from "../utils/instructorDashboardHelper.js";

export const getInstructorDashboard = async (req, res) => {};

export const getInstructorCourses = async (req, res) => {};

export const getCourseStatistics = async (req, res) => {};

```javascript
export const getStudentCount = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const courses = await getInstructorCourses(
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
```


```javascript
export const getRevenue = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const courses = await getInstructorCourses(
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
```


```javascript
export const getAverageRatings = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const courses = await getInstructorCourses(
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
```


export const getDashboardSummary = async (req, res) => {};

export const getRecentEnrollments = async (req, res) => {};

export const getTopPerformingCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const limit = Math.max(
      1,
      Math.min(10, Number(req.query.limit) || 5)
    );

    const courses = await getInstructorCourses(
      instructorId
    );

    const rankedCourses = courses
      .map((course) => {
        const students =
          course.studentsEnrolled.length;

        const revenue =
          students * course.price;

        return {
          courseId: course._id,
          courseName: course.courseName,
          thumbnail: course.thumbnail,
          students,
          revenue,
          averageRating:
            course.averageRating,
          totalRatings:
            course.totalRatings,
        };
      })
      .sort((a, b) => {
        if (b.revenue !== a.revenue)
          return b.revenue - a.revenue;

        if (
          b.students !== a.students
        )
          return b.students - a.students;

        return (
          b.averageRating -
          a.averageRating
        );
      })
      .slice(0, limit);

    return res.status(200).json({
      success: true,
      message:
        "Top performing courses fetched successfully",

      data: rankedCourses,
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

export const getMonthlyRevenue = async (req, res) => {};

export const getMonthlyEnrollments = async (req, res) => {};

export const getCourseCompletionStatistics = async (req, res) => {};

