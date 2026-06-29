import mongoose from "mongoose";

const subsectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    timeDuration: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subsection = mongoose.model("Subsection", subsectionSchema);

export default Subsection;