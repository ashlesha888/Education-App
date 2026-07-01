import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";

export const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.status !== "Published") {
      return res.status(400).json({
        success: false,
        message: "This course is not available for enrollment",
      });
    }

    if (course.instructor.toString() === studentId) {
      return res.status(400).json({
        success: false,
        message: "Instructor cannot enroll in their own course",
      });
    }

    const alreadyEnrolled = course.studentsEnrolled.some(
      (id) => id.toString() === studentId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    course.studentsEnrolled.push(studentId);
    await course.save();

    await User.findByIdAndUpdate(
      studentId,
      {
        $push: {
          courses: courseId,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Enrolled in course successfully",
      data: course,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Enrollment failed",
    });
  }
};

