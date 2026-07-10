import CourseProgress from "../models/CourseProgress.js";
import {
  validateStudent,
  validateCourse,
  validateEnrollment,
  validateSubsection,
  validateSubsectionBelongsToCourse,
  findOrCreateProgress,
  getTotalVideosInCourse,
  calculateCourseCompletion,
} from "../utils/progressHelper.js";

export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subsectionId } = req.body;
    const studentId = req.user.id;

    // Validate Request Body

    if (!courseId || !subsectionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Subsection ID are required",
      });
    }

    // Reusable Validations

    const student = await validateStudent(studentId);

    const course = await validateCourse(courseId);

    validateEnrollment(student, courseId);

    await validateSubsection(subsectionId);

    validateSubsectionBelongsToCourse(course, subsectionId);

    // Find or Create Progress

    const progress = await findOrCreateProgress(
      student,
      studentId,
      courseId
    );

    // Prevent Duplicate Completion

    const alreadyCompleted = progress.completedVideos.some(
      (videoId) => videoId.equals(subsectionId)
    );

    if (alreadyCompleted) {
      return res.status(200).json({
        success: true,
        message: "Video already completed",
        data: progress,
      });
    }

    // Update Progress

progress.completedVideos.push(subsectionId);

progress.lastWatchedVideo = subsectionId;

// Calculate completion percentage
const totalVideos = await getTotalVideosInCourse(courseId);

const completedVideos = progress.completedVideos.length;

const completionPercentage = calculateCourseCompletion(
  completedVideos,
  totalVideos
);

// Automatically mark course as completed
if (
    completionPercentage === 100 &&
    !progress.isCompleted
) {

    progress.isCompleted = true;

    progress.completedAt = new Date();

    try {

        await sendCourseCompletionEmail(
            student,
            course
        );

    }
    catch(error){

        console.error(error);

    }

}
await progress.save();

    const updatedProgress = await progress.populate(
      "completedVideos lastWatchedVideo"
    );

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
      data: updatedProgress,
      progress: {
        completedVideos,
        totalVideos,
        completionPercentage,
        isCompleted: progress.isCompleted,
        courseCompleted: progress.isCompleted
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Validate Student & Course

    const student = await validateStudent(studentId);

    await validateCourse(courseId);

    validateEnrollment(student, courseId);

    // Find Progress

    const progress = await CourseProgress.findOne({
      user: studentId,
      courseId,
    })
      .populate({
        path: "completedVideos",
        select: "title description videoUrl timeDuration",
      })
      .populate({
        path: "lastWatchedVideo",
        select: "title description videoUrl timeDuration",
      });

    // No Progress Yet

    if (!progress) {
      return res.status(200).json({
        success: true,
        message: "No course progress found",
        data: {
          completedVideos: [],
          lastWatchedVideo: null,
          isCompleted: false,
        },
      });
    }

    // Return Progress

    return res.status(200).json({
      success: true,
      message: "Course progress fetched successfully",
      data: progress,
    });

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const calculateCompletionPercentage = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Validate Student & Course

    const student = await validateStudent(studentId);

    await validateCourse(courseId);

    validateEnrollment(student, courseId);

    // Find Progress

    const progress = await CourseProgress.findOne({
      user: studentId,
      courseId,
    });

    if (!progress) {
      return res.status(200).json({
        success: true,
        completionPercentage: 0,
        completedVideos: 0,
        totalVideos: 0,
      });
    }

    // Calculate Progress

    const totalVideos = await getTotalVideosInCourse(courseId);

    const completedVideos = progress.completedVideos.length;

    const completionPercentage = calculateCourseCompletion(
      completedVideos,
      totalVideos
    );

    return res.status(200).json({
      success: true,
      progress: {
        completedVideos,
        totalVideos,
        completionPercentage,
      },
      message: "Completion percentage calculated successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const resetCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const student = await validateStudent(studentId);

    await validateCourse(courseId);

    validateEnrollment(student, courseId);

    const progress = await CourseProgress.findOne({
      user: studentId,
      courseId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    progress.completedVideos = [];
    progress.lastWatchedVideo = null;
    progress.isCompleted = false;
    progress.completedAt = null;

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Course progress reset successfully",
      data: progress,
    });

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getLastWatchedLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const student = await validateStudent(studentId);

    await validateCourse(courseId);

    validateEnrollment(student, courseId);

    const progress = await CourseProgress.findOne({
      user: studentId,
      courseId,
    }).populate({
      path: "lastWatchedVideo",
      select: "title description videoUrl timeDuration",
    });

    if (!progress || !progress.lastWatchedVideo) {
      return res.status(200).json({
        success: true,
        message: "No lecture watched yet",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Last watched lecture fetched successfully",
      data: progress.lastWatchedVideo,
    });

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getNextLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const student = await validateStudent(studentId);

    const course = await validateCourse(courseId);

    validateEnrollment(student, courseId);

    const progress = await CourseProgress.findOne({
      user: studentId,
      courseId,
    });

    // Flatten all subsections in course order
    const lectures = [];

    course.courseContent.forEach((section) => {
      section.subSections.forEach((lecture) => {
        lectures.push(lecture);
      });
    });

    if (!progress || progress.completedVideos.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Next lecture fetched successfully",
        data: lectures[0] || null,
      });
    }

    const completedIds = progress.completedVideos.map((id) =>
      id.toString()
    );

    const nextLecture =
      lectures.find(
        (lecture) => !completedIds.includes(lecture._id.toString())
      ) || null;

    return res.status(200).json({
      success: true,
      message: nextLecture
        ? "Next lecture fetched successfully"
        : "Course completed",
      data: nextLecture,
    });

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getLearningStatistics = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await validateStudent(studentId);

    const progressList = await CourseProgress.find({
      user: studentId,
    });

    const coursesEnrolled = student.courses.length;

    let coursesCompleted = 0;
    let coursesInProgress = 0;
    let totalVideosCompleted = 0;
    let totalCompletionPercentage = 0;

    for (const progress of progressList) {
      const totalVideos = await getTotalVideosInCourse(
        progress.courseId
      );

      const completedVideos = progress.completedVideos.length;

      totalVideosCompleted += completedVideos;

      const percentage = calculateCourseCompletion(
        completedVideos,
        totalVideos
      );

      totalCompletionPercentage += percentage;

      if (progress.isCompleted) {
        coursesCompleted++;
      } else {
        coursesInProgress++;
      }
    }

    const averageCompletionPercentage =
      progressList.length === 0
        ? 0
        : Number(
            (
              totalCompletionPercentage / progressList.length
            ).toFixed(2)
          );

    return res.status(200).json({
      success: true,
      statistics: {
        coursesEnrolled,
        coursesCompleted,
        coursesInProgress,
        totalVideosCompleted,
        averageCompletionPercentage,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

