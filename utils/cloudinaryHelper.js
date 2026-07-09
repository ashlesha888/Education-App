import cloudinary from "../config/cloudinary.js";
import { compressImage } from "./imageHelper.js";
import { RESOURCE_TYPES } from "../config/constants.js";

/**
 * Build Cloudinary upload options
 */
export const buildUploadOptions = (
  folder,
  resourceType,
  transformations = {}
) => {
  return {
    public_id: `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
    folder,
    resource_type: resourceType,
    quality: "auto",
    fetch_format: "auto",
    ...transformations,
  };
};

/**
 * Upload file to Cloudinary
 */
export const uploadToCloudinary = async (
  file,
  folder,
  resourceType = "auto"
) => {
  try {
    let buffer = file.buffer;

    // Compress the image buffer if applicable
    if (resourceType === RESOURCE_TYPES.IMAGE) {
      buffer = await compressImage(file.buffer, file.mimetype);
    }

    // Wrap the stream in a returned Promise so it resolves correctly
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        buildUploadOptions(folder, resourceType),
        (error, uploadResult) => {
          if (error) return reject(error);
          resolve(uploadResult);
        }
      );

      uploadStream.end(buffer);
    });

    return result;
  } catch (error) {
    const uploadError = new Error("Cloudinary upload failed.");
    uploadError.statusCode = 500;
    uploadError.cause = error;
    throw uploadError;
  }
};

/**
 * Upload Multiple Files
 */
export const uploadMultipleFiles = async (files, folder, resourceType) => {
  const uploads = files.map((file) =>
    uploadToCloudinary(file, folder, resourceType)
  );

  return await Promise.allSettled(uploads);
};

/**
 * Delete file from Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId,
  resourceType = RESOURCE_TYPES.IMAGE
) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    const deleteError = new Error("Cloudinary delete failed.");
    deleteError.statusCode = 500;
    throw deleteError;
  }
};