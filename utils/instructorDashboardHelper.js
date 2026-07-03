import Course from "../models/Course.js";
import User from "../models/User.js";
import CourseProgress from "../models/courseProgress.js";
import RatingAndReview from "../models/ratingAndReview.js";



export const getInstructorCourses = async (instructorId) => {
  const courses = await Course.find({
    instructor: instructorId,
  })
    .populate({
      path: "studentsEnrolled",
      select: "_id",
    })
    .populate({
      path: "ratingAndReviews",
      select: "rating",
    });

  return courses;
};

export const calculateInstructorRevenue = (courses) => {
  let totalRevenue = 0;

  courses.forEach((course) => {
    const enrolledStudents =
      course.studentsEnrolled.length;

    totalRevenue += enrolledStudents * course.price;
  });

  return totalRevenue;
};

export const calculateInstructorStudentCount = (
  courses
) => {
  const uniqueStudents = new Set();

  courses.forEach((course) => {
    course.studentsEnrolled.forEach((student) => {
      uniqueStudents.add(student._id.toString());
    });
  });

  return uniqueStudents.size;
};

