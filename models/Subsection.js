import mongoose from "mongoose";
import fileSchema from "./fileModel.js";

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
    video: {
      type: fileSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// --- Virtuals ---
subsectionSchema.virtual("formattedDuration").get(function () {
  if (!this.video?.duration) {
    return null;
  }

  const minutes = Math.floor(this.video.duration / 60);
  const seconds = Math.floor(this.video.duration % 60); // Math.floor ensures integers on uneven fractions

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// --- Indexing Strategy ---

// 1. Cloud Storage Cleanup Lookup Index (Optional)
// If you implement a cron-job or a delete-webhook that triggers when a lesson is deleted, 
// you will need to find the subsection by its asset ID to clean up files in Cloudinary/S3.
// This index ensures that specific media lookup doesn't trigger a full collection scan.
subsectionSchema.index({ "video.publicId": 1 }, { sparse: true });

const Subsection = mongoose.model("Subsection", subsectionSchema);

export default Subsection;