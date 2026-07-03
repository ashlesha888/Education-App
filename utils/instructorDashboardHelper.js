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


export const getInstructorDashboardData = async (
  instructorId
) => {
  const courses =
    await fetchInstructorCourses(
      instructorId
    );

  const statistics =
    calculateInstructorStatistics(
      courses
    );

  return {
    statistics,
    courses,
    topCourses: getTopCourses(courses),
    recentCourses:
      getRecentCourses(courses),
  };
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


export const getCourseStatisticsData = (
  courses
) => {
  return courses.map((course) => ({
    courseId: course._id,

    courseName: course.courseName,

    thumbnail: course.thumbnail,

    status: course.status,

    price: course.price,

    totalStudents:
      course.studentsEnrolled.length,

    totalRevenue:
      calculateCourseRevenue(course),

    averageRating:
      course.averageRating,

    totalRatings:
      course.totalRatings,

    createdAt:
      course.createdAt,
  }));
};


