import User from "../models/user.js";
import Course from "../models/course.js";
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

  const alreadyEnrolled = course.studentsEnrolled.some(
  (id) => id.toString() === studentId.toString()
);

if (alreadyEnrolled) {

  const error = new Error(
    "Student is already enrolled in this course."
  );

  error.statusCode = 400;

  throw error;

}

course.studentsEnrolled.push(studentId);

course.totalStudentsEnrolled += 1;

const alreadyPurchased = user.courses.some(
  (id) => id.toString() === courseId.toString()
);

if (!alreadyPurchased) {
  user.courses.push(courseId);
}

await course.save();

await user.save();

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
