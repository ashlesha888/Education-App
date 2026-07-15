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
 
courseProgressSchema.index({ user: 1, courseId: 1 }, { unique: true }); 
courseProgressSchema.index({ user: 1, isCompleted: 1 });

const CourseProgress =
  mongoose.models.CourseProgress ||
  mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;