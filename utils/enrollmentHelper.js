import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
/**
 * Enroll Student Into Course
 */
export const enrollStudent = async ({
  studentId,
  courseId,
}) => {

  const user =
    await User.findById(
      studentId
    );

  if (!user) {

    const error =
      new Error(
        "Student not found."
      );

    error.statusCode = 404;

    throw error;

  }

  const course =
    await Course.findById(
      courseId
    );

  if (!course) {

    const error =
      new Error(
        "Course not found."
      );

    error.statusCode = 404;

    throw error;

  }

  course.studentsEnrolled.push(
    studentId
  );

  course.totalStudentsEnrolled += 1;

  user.courses.push(
    courseId
  );

  await course.save();

  await user.save();

  return {

    user,

    course,

  };

};
