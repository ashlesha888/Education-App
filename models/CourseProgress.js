import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedVideos: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subsection",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);

export default CourseProgress;