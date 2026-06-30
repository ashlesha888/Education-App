import mongoose from "mongoose";

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

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },

    thumbnail: {
      type: uploadedImage.secure_url,
      required: true,
      trim: true,
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
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ instructor: 1 });

const Course = mongoose.model("Course", courseSchema);

export default Course;