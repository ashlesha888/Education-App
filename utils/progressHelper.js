import mongoose from "mongoose";
import User from "../models/User.js";
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



// Validate Student

export const validateStudent = async (studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid Student ID");
  }

  const student = await User.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  if (student.accountType !== "Student") {
    throw new Error("Only students can perform this action");
  }

  return student;
};

// Validate Course

export const validateCourse = async (courseId) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new Error("Invalid Course ID");
  }

  const course = await Course.findById(courseId).populate({
    path: "courseContent",
    populate: {
      path: "subSections",
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
};

// Validate Enrollment

export const validateEnrollment = (student, courseId) => {
  const enrolled = student.courses.some(
    (id) => id.toString() === courseId.toString()
  );

  if (!enrolled) {
    throw new Error("Student is not enrolled in this course");
  }

  return true;
};

// Validate Subsection

export const validateSubsection = async (subsectionId) => {
  if (!mongoose.Types.ObjectId.isValid(subsectionId)) {
    throw new Error("Invalid Subsection ID");
  }

  const subsection = await Subsection.findById(subsectionId);

  if (!subsection) {
    throw new Error("Subsection not found");
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
    throw new Error("Subsection does not belong to this course");
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
    await student.save();
  }

  return progress;
};

