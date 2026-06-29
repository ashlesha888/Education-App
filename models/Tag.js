import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 50,
    },

    tagDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

tagSchema.index({ tagName: 1 });

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;