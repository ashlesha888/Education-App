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

// --- Indexing Strategy ---

// 1. Core Lookup & Uniqueness Constraint (CRITICAL FIX)
// Ensures a user cannot have duplicate progress tracks for the same course.
// Also covers standard queries like: "Get progress for user X in course Y".
courseProgressSchema.index({ user: 1, courseId: 1 }, { unique: true });

// 2. User Dashboard Query
// Frequently used to fetch all courses a specific user is currently enrolled in.
// Note: MongoDB can already reuse the prefix of index #1 for simple { user: 1 } lookups,
// but adding a compound index with `isCompleted` is perfect for separating "In-Progress" vs "Completed" sections.
courseProgressSchema.index({ user: 1, isCompleted: 1 });

const CourseProgress =
  mongoose.models.CourseProgress ||
  mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;