import Profile from "../models/Profile.js";
import { replaceUploadedFile } from "./cloudinaryHelper.js";
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