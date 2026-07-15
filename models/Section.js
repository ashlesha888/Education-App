import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    subSections: {
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



const Section =
  mongoose.models.Section ||
  mongoose.model("Section", sectionSchema);

export default Section;