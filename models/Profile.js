import mongoose from "mongoose";

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
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;