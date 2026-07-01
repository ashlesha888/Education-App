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