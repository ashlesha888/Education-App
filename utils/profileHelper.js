import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { replaceUploadedFile, deleteFromCloudinary } from "../config/cloudinary.js";
import { formatUploadedFile, getFileMetadata } from "./fileFormatter.js";
import { CLOUDINARY_FOLDERS, RESOURCE_TYPES } from "../config/constants.js";
import { deleteUploadedFile } from "./cloudinaryHelper.js";

export const findExistingProfile = async (profileId) => {
  const profile = await Profile.findById(profileId);

  if (!profile) {
    const error = new Error("Profile not found.");
    error.statusCode = 404;
    throw error;
  }

  return profile;
};


export const uploadProfileImage = async (userId, file) => {

  const user = await User.findById(userId);
  console.log("User ID received:", userId);
  console.log("User Email:", user.email);
  console.log("Profile ID:", user.additionalData);
  if (!user) {
    throw new Error("User not found");
  }

  const profile = await Profile.findById(user.additionalData);

  if (!profile) {
    throw new Error("Profile not found");
  }

  let oldPublicId = null;

  if (
    profile.profileImage &&
    profile.profileImage.publicId
  ) {
    oldPublicId = profile.profileImage.publicId;
  }

  const uploadResult = await replaceUploadedFile({
    oldPublicId,
    file,
    folder: CLOUDINARY_FOLDERS.PROFILE_IMAGES,
    resourceType: RESOURCE_TYPES.IMAGE,
  });

  // Update User

  user.profileImage = uploadResult.secure_url;

  // Update Profile

  profile.profileImage = {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    format: uploadResult.format,
    size: uploadResult.bytes,
  };

  await user.save();
  console.log("Before save:", profile.profileImage);
  await profile.save();
  const checkProfile = await Profile.findById(profile._id);

  console.log("After save:", checkProfile.profileImage);
  return {
    user,
    profile,
  };
};

export const getProfileImageMetadata = async (profileId) => {
  const profile = await findExistingProfile(profileId);
  return getFileMetadata(profile.profileImage);
};

/**
 * Delete Profile Image
 */
import { v2 as cloudinary } from "cloudinary"; // Make sure cloudinary is imported at the top!
import mongoose from "mongoose";


export const deleteProfileImage = async (profileId) => {

  const profile = await Profile.findById(profileId);

  if (!profile) {
    throw new Error("Profile not found");
  }

  if (!profile.profileImage?.publicId) {
    throw new Error("Profile image not found");
  }

  await cloudinary.uploader.destroy(profile.profileImage.publicId);

  profile.profileImage = null;
  await profile.save();

  await User.findOneAndUpdate(
    { additionalData: profileId },
    {
      profileImage: null
    }
  );

  return profile;
}
/**
 * Update Notification Preferences
 */
export const updateNotificationPreferences = async (
  profileId,
  preferences
) => {

  const profile =
    await findExistingProfile(
      profileId
    );

  profile.notificationPreferences = {

    ...profile.notificationPreferences,

    ...preferences,

  };

  await profile.save();

  return profile.notificationPreferences;

};