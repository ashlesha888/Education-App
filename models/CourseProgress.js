
import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    lastWatchedVideo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subsection",
      default: null,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One progress document per student per course
courseProgressSchema.index({
  userId: 1,
  courseId: 1,
});

const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);

export default CourseProgress;

