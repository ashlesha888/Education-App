import Profile from "../models/Profile.js";
import { replaceUploadedFile, replaceUploadedFile, deleteFromCloudinary } from "./cloudinaryHelper.js";
import { formatUploadedFile, getFileMetadata } from "./fileFormatter.js";
import { CLOUDINARY_FOLDERS, RESOURCE_TYPES } from "../config/constants.js";

export const findExistingProfile = async (profileId) => {
  const profile = await Profile.findById(profileId);

  if (!profile) {
    const error = new Error("Profile not found.");
    error.statusCode = 404;
    throw error;
  }

  return profile;
};

export const uploadProfileImage = async (profileId, file) => {
  const profile = await findExistingProfile(profileId);

  const uploadResult = await replaceUploadedFile({
    oldPublicId: profile.profileImage?.publicId,
    file,
    folder: CLOUDINARY_FOLDERS.PROFILE_IMAGES,
    resourceType: RESOURCE_TYPES.IMAGE,
  });

  const formattedImage = formatUploadedFile(uploadResult);

  profile.profileImage = formattedImage;
  await profile.save();

  return {
    profile,
    profileImage: formattedImage,
  };
};

export const getProfileImageMetadata = async (profileId) => {
  const profile = await findExistingProfile(profileId);
  return getFileMetadata(profile.profileImage);
};

/**
 * Delete Profile Image
 */
export const deleteProfileImage = async (profileId) => {
  const profile = await findExistingProfile(profileId);

  if (!profile.profileImage || !profile.profileImage.publicId) {
    const error = new Error("Profile image not found.");
    error.statusCode = 404;
    throw error;
  }

  // Delete asset from Cloudinary
  return await deleteUploadedFile({
    model: profile,
    field: "profileImage",
    resourceType: RESOURCE_TYPES.IMAGE,
  });

  // Clear the field and save to DB
  profile.profileImage = null;
  await profile.save();

  return profile;
};
/**
 * Update Notification Preferences
 */
export const updateNotificationPreferences =
async (
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