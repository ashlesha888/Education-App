import Profile from "../models/Profile.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "./cloudinaryHelper.js";

import {
  formatUploadedFile,
} from "./fileFormatter.js";

import {
  CLOUDINARY_FOLDERS,
  RESOURCE_TYPES,
} from "../config/constants.js";
import {
  getFileMetadata,
} from "./fileFormatter.js";
/**
 * Find Existing Profile
 */
export const findExistingProfile =
  async (profileId) => {

    const profile =
      await Profile.findById(
        profileId
      );

    if (!profile) {

      const error =
        new Error(
          "Profile not found."
        );

      error.statusCode = 404;

      throw error;
    }

    return profile;
};

/**
 * Upload Profile Image
 */
export const uploadProfileImage =
  async (
    profileId,
    file
  ) => {

    const profile =
      await findExistingProfile(
        profileId
      );

    if (
      profile.profileImage?.publicId
    ) {

      const uploadResult =
await replaceUploadedFile(

profile.profileImage?.publicId,

file,

CLOUDINARY_FOLDERS.PROFILE_IMAGES,

RESOURCE_TYPES.IMAGE

);

    }

    const uploadResult =
await replaceUploadedFile(

profile.profileImage?.publicId,

file,

CLOUDINARY_FOLDERS.PROFILE_IMAGES,

RESOURCE_TYPES.IMAGE

);

    const formattedImage =
      formatUploadedFile(
        uploadResult
      );

    profile.profileImage = {

      url:
        formattedImage.url,

      publicId:
        formattedImage.publicId,

      format:
        formattedImage.format,

      size:
        formattedImage.size,

    };

    await profile.save();

    return {

      profile,

      profileImage:
        formattedImage,

    };
};

/**
 * Get Profile Image Metadata
 */
export const getProfileImageMetadata =
  async (
    profileId
  ) => {

    const profile =
      await findExistingProfile(
        profileId
      );

    return getFileMetadata(
      profile.profileImage
    );

};