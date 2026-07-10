
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import {
  uploadProfileImage, updateNotificationPreferences, 
} from "../utils/profileHelper.js";

import {
  validateFile,
} from "../utils/fileHelper.js";

import {
  validateObjectId,
} from "../utils/tagHelper.js";

import {
  MIME_TYPES,
} from "../config/constants.js";


export const updateProfile = async (req, res) => {
  try {
    const { gender, dateOfBirth, about, contactNumber } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await Profile.findById(user.additionalData);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    if (gender !== undefined) profile.gender = gender;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (about !== undefined) profile.about = about;
    if (contactNumber !== undefined) profile.contactNumber = contactNumber;

    await profile.save();

    const updatedUser = await User.findById(userId)
      .populate("additionalData")
      .lean();

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Profile.findByIdAndDelete(user.additionalData);

    await User.findByIdAndDelete(userId);

    return res
      .clearCookie("token")
      .status(200)
      .json({
        success: true,
        message: "Account deleted successfully",
      });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("additionalData")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User details fetched successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};


export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "profile_pictures"
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: uploadResult.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};



export const getPublicInstructorProfile = async (req, res) => {
  try {
    const { instructorId } = req.body;

    const instructor = await User.findById(instructorId)
      .select("firstName lastName profileImage additionalData courses accountType")
      .populate("additionalData")
      .populate("courses");

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }
    if (instructor.accountType !== "Instructor") {
      return res.status(400).json({
        success: false,
        message: "User is not an instructor",
      });
    }

    return res.status(200).json({
      success: true,
      data: instructor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch instructor profile",
    });
  }
};

/**
 * Upload Profile Image
 */
export const uploadProfileImageController =
  async (req, res) => {

    try {

      const {
        profileId,
      } = req.body;

      validateObjectId(
        profileId
      );

      validateFile(
        req.file,
        MIME_TYPES.IMAGE
      );

      const result =
        await uploadProfileImage(

          profileId,

          req.file

        );

      return res.status(200).json({

        success: true,

        message:
          "Profile image uploaded successfully.",

        data: result,

      });

    } catch (error) {

      logError(error);

      return res.status(
        error.statusCode || 500
      ).json({

        success: false,

        message:
          error.message ||
          "Internal Server Error",

      });

    }

};

import { deleteProfileImage } from "../utils/profileHelper.js";

/**
 * Delete Profile Image Controller
 */
export const deleteProfileImageController = async (req, res, next) => {
  try {
    const { profileId } = req.params;

    // 1. Fetch/Delete handling via the helper logic
    const profile = await deleteProfileImage(profileId);

    // ⭐ Improvement 2: Authorization Check
    // Ensures the acting user owns this profile before executing or confirming the change
    if (profile.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own this profile.",
      });
    }

    // ⭐ Improvement 1: Optimized Response Payload
    // Keeps network traffic light by omitting heavy/unnecessary model properties
    return res.status(200).json({
      success: true,
      message: "Profile image deleted successfully.",
      data: {
        profileId: profile._id,
        profileImage: null,
      },
    });

  } catch (error) {
    next(error);
  }
};

export const updateNotificationPreferencesController =
async (
  req,
  res,
  next
) => {

  try {

    const preferences =
      await updateNotificationPreferences(

        req.user.additionalDetails,

        req.body

      );

    return res.status(200).json({

      success: true,

      data: preferences,

    });

  } catch (error) {

    next(error);

  }

};