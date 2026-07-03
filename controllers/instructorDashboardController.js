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


export const getAverageRatings = async (req, res) => {};

export const getDashboardSummary = async (req, res) => {};

export const getRecentEnrollments = async (req, res) => {};

export const getTopPerformingCourses = async (req, res) => {};

export const getMonthlyRevenue = async (req, res) => {};

export const getMonthlyEnrollments = async (req, res) => {};

export const getCourseCompletionStatistics = async (req, res) => {};

