import SubSection from "../models/subSectionModel.js";
import { replaceUploadedFile, deleteFromCloudinary } from "./cloudinaryHelper.js";
import { formatUploadedFile, getFileMetadata } from "./fileFormatter.js";
import { CLOUDINARY_FOLDERS, RESOURCE_TYPES } from "../config/constants.js";

/**
 * Find an existing SubSection by ID or throw a 404 error
 */
export const findExistingSubSection = async (subSectionId) => {
  const subSection = await SubSection.findById(subSectionId);

  if (!subSection) {
    const error = new Error("SubSection not found.");
    error.statusCode = 404;
    throw error;
  }

  return subSection;
};

/**
 * Upload or replace a lecture video for a SubSection
 */
export const uploadLectureVideo = async (subSectionId, file) => {
  if (!file) {
    const error = new Error("Lecture video is required.");
    error.statusCode = 400;
    throw error;
  }
  const subSection = await findExistingSubSection(subSectionId);

  const uploadResult = await replaceUploadedFile({
    oldPublicId: subSection.video?.publicId,
    file,
    folder: CLOUDINARY_FOLDERS.LECTURE_VIDEOS,
    resourceType: RESOURCE_TYPES.VIDEO,
  });

  const formattedVideo = formatUploadedFile(uploadResult);

  subSection.video = formattedVideo;
  await subSection.save();

  return {
    subSection,
    video: formattedVideo,
  };
};

/**
 * Get Lecture Video Metadata
 */
export const getLectureVideoMetadata = async (subSectionId) => {
  const subSection = await findExistingSubSection(subSectionId);
  return getFileMetadata(subSection.video);
};

/**
 * Delete Lecture Video
 */
export const deleteLectureVideo = async (subSectionId) => {
  const subSection = await findExistingSubSection(subSectionId);

  if (!subSection.video || !subSection.video.publicId) {
    const error = new Error("Lecture video not found.");
    error.statusCode = 404;
    throw error;
  }

  // Delete the video asset from Cloudinary
  await deleteUploadedFile({
    model: subSection,
    field: "video",
    resourceType: RESOURCE_TYPES.VIDEO,
  });

  return subSection;
};