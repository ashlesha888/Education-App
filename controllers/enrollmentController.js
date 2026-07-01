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

export const removeEnrollment = async (req, res) => {
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

        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (student.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Only students can remove enrollment",
            });
        }
        const enrolled = course.studentsEnrolled.some(
            (id) => id.toString() === studentId
        );

        if (!enrolled) {
            return res.status(400).json({
                success: false,
                message: "Student is not enrolled in this course",
            });
        }

        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                studentsEnrolled: studentId,
            },
        });

        await User.findByIdAndUpdate(studentId, {
            $pull: {
                courses: courseId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Enrollment removed successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove enrollment",
        });
    }
};

export const getEnrolledCourses = async (req, res) => {
    try {
        const studentId = req.user.id;
        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        if (student.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Only students can access enrolled courses",
            });
        }
        await student.populate({
                path: "courses",
                populate: [
                    {
                        path: "instructor",
                        select: "firstName lastName email profileImage",
                    },
                    {
                        path: "tag",
                        select: "name",
                    },
                    {
                        path: "courseContent",
                        populate: {
                            path: "subSections",
                        },
                    },
                    {
                        path: "ratingAndReviews",
                        populate: {
                            path: "user",
                            select: "firstName lastName profileImage",
                        },
                    },
                ],
            })

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: student.courses,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled courses",
        });
    }
};

export const checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

   
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID",
      });
    }

    
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "Only students can check enrollment status",
      });
    }

  
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

   
    const isEnrolled = course.studentsEnrolled.some(
      (id) => id.toString() === studentId
    );

    return res.status(200).json({
      success: true,
      enrolled: isEnrolled,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to check enrollment status",
    });
  }
};

