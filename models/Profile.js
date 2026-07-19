import mongoose from "mongoose";
import fileSchema from "./fileSchema.js";

const profileSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    about: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    contactNumber: {
    type: String,
  trim: true,
  maxlength: 15,
  default: undefined,
},
    profileImage: {
      type: fileSchema,
      default: null,
    },
    coverImage: {
      type: fileSchema,
      default: null,
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      announcements: {
        type: Boolean,
        default: true,
      },
      purchases: {
        type: Boolean,
        default: true,
      },
      courseCompletion: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.set("toJSON", {
  minimize: true,
});

// --- Virtuals ---
profileSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - this.dateOfBirth.getFullYear();
  const monthDifference = today.getMonth() - this.dateOfBirth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < this.dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
});


const Profile =
  mongoose.models.Profile ||
  mongoose.model("Profile",profileSchema);

export default Profile;