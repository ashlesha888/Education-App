import SubSection from "../models/subSectionModel.js";

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

/**
 * Upload Lecture Video
 */
export const uploadLectureVideo =
  async (
    subSectionId,
    file
  ) => {

    const subSection =
  await findExistingSubSection(
    subSectionId
  );

    if (!subSection) {
      const error =
        new Error(
          "SubSection not found."
        );

      error.statusCode = 404;

      throw error;
    }

    // Delete old video (if exists)
    if (
      subSection.video?.publicId
    ) {
      await deleteFromCloudinary(
        subSection.video.publicId,
        RESOURCE_TYPES.VIDEO
      );
    }

    // Upload new video
    const uploadResult =
      await uploadToCloudinary(
        file,
        CLOUDINARY_FOLDERS.LECTURE_VIDEOS,
        RESOURCE_TYPES.VIDEO
      );

    const formattedVideo =
      formatUploadedFile(
        uploadResult
      );

    // Save video details
    subSection.video = {
      url:
        formattedVideo.url,

      publicId:
        formattedVideo.publicId,

      duration:
        formattedVideo.duration,

      format:
        formattedVideo.format,

      size:
        formattedVideo.size,
    };

    await subSection.save();

    return {
      subSection,
      video:
        formattedVideo,
    };
};

export const findExistingSubSection =
  async (
    subSectionId
  ) => {

    const subSection =
      await SubSection.findById(
        subSectionId
      );

    if (!subSection) {
      const error =
        new Error(
          "SubSection not found."
        );

      error.statusCode = 404;

      throw error;
    }

    return subSection;
};






















