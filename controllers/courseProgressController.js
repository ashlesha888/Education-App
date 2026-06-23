import CourseProgress from "../models/courseProgress.js";
import Subsection from "../models/subsection.js";

// =========================================================================
// UPDATE COURSE PROGRESS (Mark Video Lesson as Completed)
// =========================================================================
export const updateCourseProgress = async (req, res) => {
    try {
        const { courseId, subsectionId } = req.body;
        const userId = req.user.id; // From the auth middleware token

        // 1. Check if the video lesson actually exists
        const subsection = await Subsection.findById(subsectionId);
        if (!subsection) {
            return res.status(404).json({
                success: false,
                message: "Video lesson not found",
            });
        }

        // 2. Find the existing progress document for this specific user and course
        let progress = await CourseProgress.findOne({
            courseId: courseId,
            // Assuming your User schema links to courseProgress array,
            // we search directly by matching fields here.
        });

        // If no tracking document exists yet, create a new one for the user
        if (!progress) {
            progress = await CourseProgress.create({
                courseId: courseId,
                completedVideos: [subsectionId],
            });

            return res.status(200).json({
                success: true,
                message: "Course tracking initialized and first lesson marked completed",
                data: progress,
            });
        }

        // 3. If tracking document exists, check if the video is already marked completed
        if (progress.completedVideos.includes(subsectionId)) {
            return res.status(400).json({
                success: false,
                message: "This video lesson is already marked as completed",
            });
        }

        // 4. Push the new completed video ID into the tracking array
        progress.completedVideos.push(subsectionId);
        await progress.save();

        return res.status(200).json({
            success: true,
            message: "Lesson marked completed successfully",
            data: progress,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update course progress",
            error: error.message,
        });
    }
};
