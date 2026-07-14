import mongoose from "mongoose";

import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

import Section from "../models/Section.js";
import Subsection from "../models/Subsection.js";
import RatingAndReview from "../models/RatingAndReview.js";
import {
  uploadCourseThumbnail,
} from "../utils/courseHelper.js";
import {
  deleteCourseThumbnail,
} from "../utils/courseHelper.js";
import {
  validateObjectId,
} from "../utils/tagHelper.js";

import {
  validateFile,
} from "../utils/fileHelper.js";

import {
  MIME_TYPES,
} from "../config/constants.js";
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
      {
        status: "Published",
      },
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


export const updateCourseThumbnail = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    const uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "course_thumbnails"
    );

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { thumbnail: uploadedImage.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course thumbnail updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Thumbnail upload failed",
    });
  }
};


export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if Course ID is provided
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID",
      });
    }

    const course = await Course.findById(courseId)
      .populate({
        path: "instructor",
        select: "firstName lastName email profileImage",
      })
      .populate({
        path: "courseContent",
        select: "sectionName subSections",
        populate: {
          path: "subSections",
          select: "title description videoUrl timeDuration",
        },
      })
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "firstName lastName profileImage",
        },
      })
      .populate({
        path: "tag",
        select: "name description",
      })
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
      message: "Course fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching course:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};


export const updateCourse = async (req, res) => {
  try {
    const {
      courseId,
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
    } = req.body;

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

    // Only the course instructor can update it
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this course",
      });
    }

    // Update only the provided fields
    if (courseName) {
      course.courseName = courseName;
    }

    if (courseDescription) {
      course.courseDescription = courseDescription;
    }

    if (whatYouWillLearn) {
      course.whatYouWillLearn = whatYouWillLearn;
    }

    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative",
        });
      }

      course.price = price;
    }

    if (tag) {
      course.tag = tag;
    }

    await course.save();

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "instructor",
        select: "firstName lastName email profileImage",
      })
      .populate({
        path: "courseContent",
        select: "sectionName subSections",
        populate: {
          path: "subSections",
          select: "title description videoUrl timeDuration",
        },
      })
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "firstName lastName profileImage",
        },
      })
      .populate({
        path: "tag",
        select: "name description",
      });

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};




export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate Course ID
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

    // Find Course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    // Remove course from instructor
    await User.findByIdAndUpdate(course.instructor, {
      $pull: {
        courses: course._id,
      },
    });

    // Remove course from enrolled students
    await User.updateMany(
      {
        _id: {
          $in: course.studentsEnrolled,
        },
      },
      {
        $pull: {
          courses: course._id,
        },
      }
    );

    // Delete all subsections
    for (const sectionId of course.courseContent) {
      const section = await Section.findById(sectionId);

      if (section) {
        await Subsection.deleteMany({
          _id: {
            $in: section.subSections,
          },
        });
      }
    }

    // Delete all sections
    await Section.deleteMany({
      _id: {
        $in: course.courseContent,
      },
    });

    // Delete ratings
    await RatingAndReview.deleteMany({
      course: courseId,
    });

    // Delete course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};


export const updateCourseStatus = async (req, res) => {
  try {
    const { courseId, status } = req.body;

    // Validate required fields
    if (!courseId || !status) {
      return res.status(400).json({
        success: false,
        message: "Course ID and status are required",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID",
      });
    }

    // Validate status
    if (!["Draft", "Published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Draft' or 'Published'",
      });
    }

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this course",
      });
    }

    // Update status
    course.status = status;

    await course.save();

    return res.status(200).json({
      success: true,
      data: course,
      message: `Course ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update course status",
    });
  }
};

export const getCoursesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;

    if (!instructorId) {
      return res.status(400).json({
        success: false,
        message: "Instructor ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Instructor ID",
      });
    }

    const instructor = await User.findById(instructorId);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    if (instructor.accountType !== "Instructor") {
      return res.status(400).json({
        success: false,
        message: "User is not an instructor",
      });
    }

    const courses = await Course.find({
      instructor: instructorId,
      status: "Published",
    })
      .populate({
        path: "instructor",
        select: "firstName lastName profileImage",
      })
      .populate({
        path: "tag",
        select: "name",
      });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
      message: "Instructor courses fetched successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor courses",
    });
  }
};

export const searchCourses = async (
  queryParams
) => {
  const courseQuery =
    buildCourseQuery(
      queryParams
    );

  if (
  queryParams.published !==
  undefined
) {
  courseQuery.status =
    queryParams.published ===
    "true"
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;
} else {
  courseQuery.status =
    COURSE_STATUS.PUBLISHED;
}

  const sort =
    buildSortQuery(
      queryParams.sort
    );

  const pagination =
    buildPaginationQuery(
      queryParams.page,
      queryParams.limit
    );

  const courses =
    await Course.find(courseQuery)
      .populate(
        "instructor",
        "firstName lastName profileImage"
      )
      .populate(
        "category",
        "name"
      )
      .populate(
        "tags",
        "name"
      )
      .sort(sort)
      .skip(
        pagination.skip
      )
      .limit(
        pagination.limit
      )
      .lean();

  const totalCourses =
    await Course.countDocuments(
      courseQuery
    );

  return {
    courses,

    pagination: {
      page:
        pagination.page,

      limit:
        pagination.limit,

      totalCourses,

      totalPages:
        Math.ceil(
          totalCourses /
          pagination.limit
        ),
    },
  };
};

export const filterCoursesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    const courses = await Course.find({
      tag: categoryId,
      status: "Published",
    })
      .populate({
        path: "instructor",
        select: "firstName lastName profileImage",
      })
      .populate({
        path: "tag",
        select: "name description",
      });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
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

export const uploadCourseThumbnailController = async (req, res) => {
    try {

      const { courseId } =
        req.body;

      validateObjectId(
        courseId
      );

      validateFile(
        req.file,
        MIME_TYPES.IMAGE
      );
if (
  course.instructor.toString() !==
  req.user.id
) {
  const error = new Error(
    "You are not authorized to update this course."
  );

  error.statusCode = 403;

  throw error;
}
      const result =
        await uploadCourseThumbnail(
          courseId,
          req.file
        );

      return res.status(200).json({
        success: true,

        message:
          COURSE_MESSAGES.THUMBNAIL_UPLOADED,

        data: result,
      });

    } catch (error) {

      logError(error);

      return res.status(
        error.statusCode || 500
      ).json({
        success: false,

        message:
          error.message ||
          "Internal Server Error",
      });
    }
};

/**
 * Delete Course Thumbnail
 */
export const deleteCourseThumbnailController =
  async (
    req,
    res
  ) => {

    try {

      const {
        courseId,
      } = req.body;

      validateObjectId(
        courseId
      );

      const course =
        await deleteCourseThumbnail(
          courseId
        );

      return res.status(200).json({

        success: true,

        message:
          "Course thumbnail deleted successfully.",

        data: course,

      });

    } catch (error) {

      logError(error);

      return res.status(
        error.statusCode || 500
      ).json({

        success: false,

        message:
          error.message ||
          "Internal Server Error",

      });

    }

};



