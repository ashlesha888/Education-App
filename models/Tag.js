import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Automatically creates a unique index for tagName
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
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

// --- Pre-validate Middleware ---
// Automatically generates the URL-friendly slug before validation checks run
tagSchema.pre("validate", function (next) {
  if (this.tagName && (!this.slug || this.isModified("tagName"))) {
    this.slug = this.tagName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/(^-|-$)+/g, "");  // Trim hyphens from ends
  }
  next();
});

// --- Indexing Strategy ---

// 1. Slug Lookup Index
// Added explicitly for looking up a category/tag page by its URL slug.
// e.g., Tag.findOne({ slug: req.params.slug })
//tagSchema.index({ slug: 1 });

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;