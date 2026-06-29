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
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;