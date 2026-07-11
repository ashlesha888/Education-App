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

// --- Indexing Strategy ---

// NOTE: The primary lookup for a Section is handled via its implicit default `_id` index 
// when MongoDB populates data from the Course model (`Course.findById(id).populate('courseContent')`).

// 1. Relational Backup Index (Optional but highly recommended for parent-child API routes)
// If your backend utilizes route architectures that query child elements via parent relationships 
// directly (e.g., Section.find({ courseId: id })), you should instead introduce a `courseId` field 
// into this schema and index it like this:
// sectionSchema.index({ courseId: 1 });

const Section = mongoose.model("Section", sectionSchema);

export default Section;