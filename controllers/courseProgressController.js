import CourseProgress from "../models/CourseProgress.js";
import Subsection from "../models/Subsection.js";

export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subsectionId } = req.body;

    if (!courseId || !subsectionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Subsection ID are required",
      });
    }

    const subsection = await Subsection.findById(subsectionId);

    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    let progress = await CourseProgress.findOne({ courseId });

    if (!progress) {
      progress = await CourseProgress.create({
        courseId,
        completedVideos: [subsectionId],
      });

      return res.status(201).json({
        success: true,
        data: progress,
        message: "Course progress created successfully",
      });
    }

    if (progress.completedVideos.includes(subsectionId)) {
      return res.status(409).json({
        success: false,
        message: "Video already marked as completed",
      });
    }

    progress.completedVideos.addToSet(subsectionId);

    await progress.save();

    return res.status(200).json({
      success: true,
      data: progress,
      message: "Course progress updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update course progress",
    });
  }
};