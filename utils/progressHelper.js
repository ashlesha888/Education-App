import mongoose from "mongoose";
import User from "../models/User.js";
import AppError from "./AppError.js";
import Course from "../models/Course.js";
import Subsection from "../models/Subsection.js";
import CourseProgress from "../models/CourseProgress.js";


// Returns total number of videos (subsections) in a course.

export const getTotalVideosInCourse = async (courseId) => {
  const course = await Course.findById(courseId).populate({
    path: "courseContent",
    populate: {
      path: "subSections",
    },
  });

  if (!course) {
    return 0;
  }

  let totalVideos = 0;

  course.courseContent.forEach((section) => {
    totalVideos += section.subSections.length;
  });

  return totalVideos;
};


// Calculates course completion percentage.
 
export const calculateCourseCompletion = (
  completedVideos,
  totalVideos
) => {
  if (totalVideos === 0) {
    return 0;
  }

  return Number(
  ((completedVideos / totalVideos) * 100).toFixed(2)
);
};



// Validate Student

export const validateStudent = async (studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new AppError("Invalid Student ID", 400);
  }

  const student = await User.findById(studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  if (student.accountType !== "Student") {
    throw new AppError("Only students can perform this action", 403);
  }

  return student;
};

// Validate Course

export const validateCourse = async (courseId) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid Course ID", 400)
  }

  const course = await Course.findById(courseId).populate({
    path: "courseContent",
    populate: {
      path: "subSections",
    },
  });

  if (!course) {
    throw new AppError("Course not found", 404)
  }

  return course;
};

// Validate Enrollment

export const validateEnrollment = (student, courseId) => {
  const enrolled = student.courses.some(
    (id) => id.toString() === courseId.toString()
  );

  if (!enrolled) {
    throw new AppError("Student is not enrolled in this course", 403)
  }

  return true;
};

// Validate Subsection

export const validateSubsection = async (subsectionId) => {
  if (!mongoose.Types.ObjectId.isValid(subsectionId)) {
    throw new AppError("Invalid Subsection ID", 400);
  }

  const subsection = await Subsection.findById(subsectionId);

  if (!subsection) {
    throw new AppError("Subsection not found", 404);
  }

  return subsection;
};

// Validate Subsection belongs to Course

export const validateSubsectionBelongsToCourse = (
  course,
  subsectionId
) => {
  const belongs = course.courseContent.some((section) =>
    section.subSections.some(
      (video) => video._id.toString() === subsectionId.toString()
    )
  );

  if (!belongs) {
    throw new AppError("Subsection does not belong to this course", 400);
  }

  return true;
};

// Find/Create Progress

export const findOrCreateProgress = async (
  student,
  studentId,
  courseId
) => {
  let progress = await CourseProgress.findOne({
    user: studentId,
    courseId,
  });

  if (!progress) {
    progress = await CourseProgress.create({
      user: studentId,
      courseId,
    });

    student.courseProgress.push(progress._id);
    await student.save
  }

  return progress;
};


// Get Total Videos in a Course

export const getTotalVideosInCourse = async (courseId) => {
  const course = await Course.findById(courseId).populate({
    path: "courseContent",
    populate: {
      path: "subSections",
    },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  let totalVideos = 0;

  course.courseContent.forEach((section) => {
    totalVideos += section.subSections.length;
  });

  return totalVideos;
};

// Calculate Course Completion Percentage

export const calculateCourseCompletion = (
  completedVideos,
  totalVideos
) => {
  if (totalVideos === 0) {
    return 0;
  }

  return Number(
  ((completedVideos / totalVideos) * 100).toFixed(2)
);
};

