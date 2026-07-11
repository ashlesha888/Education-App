import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // Automatically registers a unique index for email
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      default: "Student",
      required: true,
    },
    additionalData: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    profileImage: {
      type: String,
      required: true,
    },
    courseProgress: [
      {
        type: Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspendedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// --- Virtual for Full Name ---
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Single-field indexes for the User Schema
userSchema.index({ accountType: 1 });
userSchema.index({ active: 1 });

// Note: If 'email' has { unique: true }, MongoDB creates the index automatically. 
// If not, uncomment the line below:
// userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;