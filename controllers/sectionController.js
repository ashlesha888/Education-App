import Section from "../models/section.js";
import Subsection from "../models/subsection.js";
import Course from "../models/course.js";

// =========================================================================
// 1. CREATE SECTION (e.g., "Chapter 1: Getting Started")
// =========================================================================
export const createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: sectionName and courseId",
            });
        }

        // Create the new section document
        const newSection = await Section.create({ sectionName });

        // Update the Course record by pushing the new section's ID into its content array
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { new: true }
        )
        .populate({
            path: "courseContent",
            populate: { path: "subSection" } // Deeply populates both sections and nested videos
        })
        .exec();

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create section, please try again",
            error: error.message,
        });
    }
};

// =========================================================================
// 2. CREATE SUBSECTION (The actual video lesson inside a section)
// =========================================================================
export const createSubsection = async (req, res) => {
    try {
        const { sectionId, title, timeDuration, description, videoUrl } = req.body;

        if (!sectionId || !title || !timeDuration || !description || !videoUrl) {
            return res.status(400).json({
                success: false,
                message: "All subsection details are required",
            });
        }

        // Create the individual lecture video record
        const newSubsection = await Subsection.create({
            title,
            timeDuration,
            description,
            videoUrl,
        });

        // Link this video record directly into the parent Section array
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { $push: { subSection: newSubsection._id } },
            { new: true }
        ).populate("subSection").exec();

        return res.status(200).json({
            success: true,
            message: "Video lecture uploaded successfully",
            data: updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to upload subsection, please try again",
            error: error.message,
        });
    }
};
