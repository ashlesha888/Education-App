import mongoose from "mongoose";
import fileSchema from "./fileSchema.js";

// Define Status Constants to avoid ReferenceError
export const COURSE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    courseDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    whatYouWillLearn: {
      type: String,
      required: true,
      trim: true,
    },
    courseContent: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Section",
        },
      ],
      default: [],
    },
    ratingAndReviews: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RatingAndReview",
        },
      ],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(COURSE_STATUS),
      default: COURSE_STATUS.DRAFT,
    },
    thumbnail: {
      type: fileSchema,
      required: true,
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
    studentsEnrolled: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    totalStudentsEnrolled: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Single-field indexes for the Course Schema
courseSchema.index({ status: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ averageRating: -1 }); // Indexing in descending order since we usually sort by highest rating
// Compound index for instructor dashboards and filtering
courseSchema.index({ instructor: 1, status: 1 });


const Course = mongoose.model("Course", courseSchema);

export default Course;