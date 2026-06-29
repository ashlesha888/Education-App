import Course from "../models/Course.js";
import User from "../models/User.js";

export const createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      thumbnail,
      tag,
    } = req.body;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !thumbnail ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "All course fields are required",
      });
    }

    const instructorId = req.user.id;

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorId,
      whatYouWillLearn,
      price,
      thumbnail,
      tag,
    });

    await User.findByIdAndUpdate(
      instructorId,
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );

    return res.status(201).json({
      success: true,
      data: newCourse,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: 1,
        price: 1,
        thumbnail: 1,
        instructor: 1,
        ratingAndReviews: 1,
        studentsEnrolled: 1,
      }
    )
      .populate({
        path: "instructor",
        select: "firstName lastName email profileImage",
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: allCourses,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};