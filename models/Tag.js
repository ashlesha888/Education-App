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
 
tagSchema.pre("validate", function (next) {
  if (this.tagName && (!this.slug || this.isModified("tagName"))) {
    this.slug = this.tagName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") 
      .replace(/(^-|-$)+/g, "");  
  }
  next();
});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;