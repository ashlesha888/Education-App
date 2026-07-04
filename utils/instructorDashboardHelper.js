import Course from "../models/Course.js";
import User from "../models/User.js";
import CourseProgress from "../models/courseProgress.js";
import RatingAndReview from "../models/ratingAndReview.js";


export const getEnrollmentCount = (course) => {
  if (!course || !course.studentsEnrolled) return 0;
  return course.studentsEnrolled.length;
};

export const calculateCourseRevenue = (course) => {
  if (!course) return 0;


  const studentCount = getEnrollmentCount(course);
  const price = course.price || 0;

  return studentCount * price;
};

export const calculateInstructorRevenue = (courses) => {
  return courses.reduce(
    (totalRevenue, course) =>
      totalRevenue + calculateCourseRevenue(course),
    0
  );
};

export const calculateInstructorStudentCount = (courses) => {
  const uniqueStudents = new Set();

  courses.forEach((course) => {
    course.studentsEnrolled.forEach((student) => {
      uniqueStudents.add(student._id.toString());
    });
  });

  return uniqueStudents.size;
};

export const calculateInstructorStatistics = (courses) => {
  const totalCourses = courses.length;

  const totalStudents =
    calculateInstructorStudentCount(courses);

  const totalRevenue =
    calculateInstructorRevenue(courses);

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

  const averageStudentsPerCourse =
    totalCourses > 0
      ? Number(
        (
          totalStudents / totalCourses
        ).toFixed(1)
      )
      : 0;

  const averageRevenuePerCourse =
    totalCourses > 0
      ? Number(
        (
          totalRevenue / totalCourses
        ).toFixed(2)
      )
      : 0;

  return {
    totalCourses,
    totalStudents,
    totalRevenue,
    overallAverageRating,
    averageStudentsPerCourse,
    averageRevenuePerCourse,
  };
};


export const fetchInstructorCourses = async (
  instructorId,
  {
    populateStudents = true,
    lean = true,
  } = {}
) => {
  let query = Course.find({
    instructor: instructorId,
  }).select(
    "courseName thumbnail price averageRating totalRatings studentsEnrolled status createdAt"
  );

  if (populateStudents) {
    query = query.populate({
      path: "studentsEnrolled",
      select: "_id",
    });
  }

  if (lean) {
    query = query.lean();
  }

  return await query;
};

export const sortCourses = (
  courses,
  sortBy = "revenue",
  order = "desc"
) => {
  const sortedCourses = [...courses];

  sortedCourses.sort((a, b) => {
    let valueA;
    let valueB;

    switch (sortBy) {
      case "students":
        valueA = a.studentsEnrolled.length;
        valueB = b.studentsEnrolled.length;
        break;

      case "rating":
        valueA = a.averageRating;
        valueB = b.averageRating;
        break;

      case "price":
        valueA = a.price;
        valueB = b.price;
        break;

      case "createdAt":
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;

      case "revenue":
      default:
        valueA = calculateCourseRevenue(a);
        valueB = calculateCourseRevenue(b);
    }

    return order === "asc"
      ? valueA - valueB
      : valueB - valueA;
  });

  return sortedCourses;
};


export const formatCourseDashboardData = (
  course
) => {
  return {
    courseId: course._id,
    courseName: course.courseName,
    thumbnail: course.thumbnail,
    price: course.price,
    status: course.status,
    averageRating: course.averageRating,
    totalRatings: course.totalRatings,
    totalStudents:
      course.studentsEnrolled.length,
    revenue:
      calculateCourseRevenue(course),
    createdAt: course.createdAt,
  };
};



export const getInstructorDashboardData =
  async (
    instructorId,
    {
      topCourses = true,
      recentCourses = false,
      monthlyRevenue = false,
      monthlyEnrollments = false,
      courseStatistics = false,
      completionStatistics = false,
      page = 1,   
    limit = 10, 
    } = {}
  ) => {
    const courses =
      await fetchInstructorCourses(
        instructorId
      );

    const statistics =
      calculateInstructorStatistics(
        courses
      );

    const result = {
      courses,
      statistics,
    };

    if (topCourses) {
      result.topCourses =
        getTopCourses(courses);
    }

    if (recentCourses) {
      result.recentCourses =
        getRecentCourses(courses);
    }

    if (monthlyRevenue) {
      result.monthlyRevenue =
        getMonthlyRevenueData(courses);
    }

    if (monthlyEnrollments) {
      result.monthlyEnrollments =
        getMonthlyEnrollmentsData(
          courses
        );
    }

if (courseStatistics) {
  
    result.courseStatistics = getCourseStatisticsData(courses, page, limit);
  }

    if (
      completionStatistics
    ) {
      result.completionStatistics =
        await getCourseCompletionStatistics(
          courses
        );
    }

    return result;
  };






export const getTopCourses = (
  courses,
  limit = 5
) => {
  return sortCourses(
    courses,
    "revenue",
    "desc"
  )
    .slice(0, limit)
    .map(formatCourseDashboardData);
};

export const getRecentCourses = (
  courses,
  limit = 5
) => {
  return sortCourses(
    courses,
    "createdAt",
    "desc"
  )
    .slice(0, limit)
    .map(formatCourseDashboardData);
};


export const getCourseStatisticsData = (courses, page = 1, limit = 10) => {
  
  // 1. Map the raw database courses to your dashboard structure first
  const statistics = courses.map((course) => ({
    courseId: course._id,
    courseName: course.courseName,
    thumbnail: course.thumbnail,
    status: course.status,
    price: course.price,
    totalStudents: course.studentsEnrolled.length,
    totalRevenue: calculateCourseRevenue(course),
    averageRating: course.averageRating,
    totalRatings: course.totalRatings,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    whatYouWillLearn: course.whatYouWillLearn,
  }));

  // 2. Apply your pagination calculations
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedStatistics = statistics.slice(startIndex, endIndex);

  // 3. Return the grouped object with pagination metadata
  return {
    statistics: paginatedStatistics,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(statistics.length / limit),
      totalCourses: statistics.length,
      limit,
      hasNextPage: endIndex < statistics.length,
      hasPreviousPage: page > 1,
    },
  };
};

export const getRecentEnrollmentsData = (
  courses,
  limit = 10
) => {
  const enrollments = [];

  courses.forEach((course) => {
    course.studentsEnrolled.forEach(
      (student) => {
        enrollments.push({
          studentId: student._id,

          firstName:
            student.firstName,

          lastName:
            student.lastName,

          email:
            student.email,

          courseId:
            course._id,

          courseName:
            course.courseName,

          enrolledAt:
            student.createdAt,
        });
      }
    );
  });

  return enrollments
    .sort(
      (a, b) =>
        new Date(
          b.enrolledAt
        ) -
        new Date(
          a.enrolledAt
        )
    )
    .slice(0, limit);
};

export const getMonthlyRevenueData = (
  courses
) => {
  const monthlyRevenue =
    {};

  courses.forEach((course) => {
    const revenueDate =
  course.updatedAt ||
  course.createdAt;

const month =
  new Date(
    revenueDate
  ).toLocaleString(
    "default",
    {
      month: "short",
    }
  );

    const revenue =
      calculateCourseRevenue(
        course
      );

    monthlyRevenue[
      month
    ] =
      (monthlyRevenue[
        month
      ] || 0) + revenue;
  });

  return Object.entries(
    monthlyRevenue
  ).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );
};


export const getMonthlyEnrollmentsData = (
  courses
) => {
  const monthlyEnrollments = {};

  courses.forEach((course) => {
    const enrollmentDate =
  course.updatedAt ||
  course.createdAt;

const month =
  new Date(
    enrollmentDate
  ).toLocaleString(
    "default",
    {
      month: "short",
    }
  );

    monthlyEnrollments[month] =
      (monthlyEnrollments[month] || 0) +
      course.studentsEnrolled.length;
  });

  return Object.entries(
    monthlyEnrollments
  ).map(([month, enrollments]) => ({
    month,
    enrollments,
  }));
};



export const getCourseCompletionStatistics =
  async (courses) => {
    const courseIds = courses.map(
      (course) => course._id
    );

    const progressStats =
      await CourseProgress.aggregate([
        {
          $match: {
            courseId: {
              $in: courseIds,
            },
          },
        },
        {
          $group: {
            _id: "$courseId",

            totalStudents: {
              $sum: 1,
            },

            completedStudents: {
              $sum: {
                $cond: [
                  "$isCompleted",
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

    const statsMap = new Map();

    progressStats.forEach((stat) => {
      statsMap.set(
        stat._id.toString(),
        stat
      );
    });

    return courses.map((course) => {
      const stat = statsMap.get(
        course._id.toString()
      );

      const totalStudents =
        stat?.totalStudents || 0;

      const completedStudents =
        stat?.completedStudents || 0;

      const completionRate =
        totalStudents > 0
          ? Number(
            (
              (completedStudents /
                totalStudents) *
              100
            ).toFixed(2)
          )
          : 0;

return {
    courseId: course._id,
    courseName: course.courseName,
    thumbnail: course.thumbnail,
    totalStudents,
    completedStudents,
    completionRate,
    averageRating:
        course.averageRating,
    totalRatings:
        course.totalRatings,
};
    });
  };





