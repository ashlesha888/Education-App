import mongoose from "mongoose";
import Course from "../models/Course.js";
import Section from "../models/Section.js";
import Subsection from "../models/Subsection.js";

export const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and course ID are required",
      });
    }

    const newSection = await Section.create({
      sectionName,
    });

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      {
        new: true,
      }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .lean();

    return res.status(201).json({
      success: true,
      data: updatedCourse,
      message: "Section created successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create section",
    });
  }
};

export const createSubsection = async (req, res) => {
  try {
    const {
      sectionId,
      title,
      timeDuration,
      description,
      videoUrl,
    } = req.body;

    if (
      !sectionId ||
      !title ||
      !timeDuration ||
      !description ||
      !videoUrl
    ) {
      return res.status(400).json({
        success: false,
        message: "All subsection fields are required",
      });
    }

    const newSubsection = await Subsection.create({
      title,
      timeDuration,
      description,
      videoUrl,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: newSubsection._id,
        },
      },
      {
        new: true,
      }
    )
      .populate("subSection")
      .lean();

    return res.status(201).json({
      success: true,
      data: updatedSection,
      message: "Subsection created successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create subsection",
    });
  }
};

export const updateSection = async (req, res) => {
  try {
    const { sectionId, sectionName } = req.body;

    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "Section ID and Section Name are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Section ID",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      {
        new: true,
      }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "Section updated successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update section",
    });
  }
};

export const updateSubsection = async (req, res) => {
  try {
    const {
      courseId,
      sectionId,
      subsectionId,
      title,
      description,
      videoUrl,
      timeDuration,
    } = req.body;

    if (!courseId || !sectionId || !subsectionId) {
      return res.status(400).json({
        success: false,
        message: "courseId, sectionId and subsectionId are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(sectionId) ||
      !mongoose.Types.ObjectId.isValid(subsectionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid IDs",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const subsection = await Subsection.findById(subsectionId);

    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    const updatedSubsection = await Subsection.findByIdAndUpdate(
      subsectionId,
      {
        title,
        description,
        videoUrl,
        timeDuration,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedSubsection,
      message: "Subsection updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update subsection",
    });
  }
};

export const deleteSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.body;

    if (!courseId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Section ID are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(sectionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID or Section ID",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this section",
      });
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const isSectionInCourse = course.courseContent.includes(sectionId);

    if (!isSectionInCourse) {
      return res.status(400).json({
        success: false,
        message: "Section does not belong to this course",
      });
    }

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });

    if (section.subSections && section.subSections.length > 0) {
      await Subsection.deleteMany({
        _id: {
          $in: section.subSections,
        },
      });
    }

    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete section",
    });
  }
};

export const deleteSubsection = async (req, res) => {
  try {
    const { courseId, sectionId, subsectionId } = req.body;

    if (!courseId || !sectionId || !subsectionId) {
      return res.status(400).json({
        success: false,
        message: "All IDs are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(sectionId) ||
      !mongoose.Types.ObjectId.isValid(subsectionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid IDs",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    await Section.findByIdAndUpdate(sectionId, {
      $pull: {
        subSections: subsectionId,
      },
    });

    const deletedSubsection = await Subsection.findByIdAndDelete(subsectionId);

    if (!deletedSubsection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete subsection",
    });
  }
};

export const reorderSections = async (req, res) => {
  try {
    const { courseId, orderedSectionIds } = req.body;

    if (!courseId || !orderedSectionIds) {
      return res.status(400).json({
        success: false,
        message: "courseId and orderedSectionIds are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const valid =
      orderedSectionIds.length === course.courseContent.length &&
      orderedSectionIds.every((id) =>
        course.courseContent.map((s) => s.toString()).includes(id)
      );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid section order",
      });
    }

    course.courseContent = orderedSectionIds;

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Sections reordered successfully",
      data: course,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to reorder sections",
    });
  }
};

export const reorderSubsections = async (req, res) => {
  try {
    const { sectionId, orderedSubsectionIds } = req.body;

    if (!sectionId || !orderedSubsectionIds) {
      return res.status(400).json({
        success: false,
        message: "sectionId and orderedSubsectionIds are required",
      });
    }

 
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sectionId",
      });
    }

    
    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

  
    const valid =
      orderedSubsectionIds.length === section.subSections.length &&
      orderedSubsectionIds.every((id) =>
        section.subSections.map((s) => s.toString()).includes(id)
      );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid subsection order",
      });
    }

    section.subSections = orderedSubsectionIds;

    await section.save();

    return res.status(200).json({
      success: true,
      message: "Subsections reordered successfully",
      data: section,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to reorder subsections",
    });
  }
};


