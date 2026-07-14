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



/**
 * Delete uploaded file from Cloudinary
 * and remove its reference from the model instance.
 * 
 * @param {Object} params
 * @param {Object} params.modelInstance - The Mongoose/DB document instance (e.g., profile, subSection)
 * @param {string} params.field - The field name containing the file object (e.g., 'profileImage', 'video')
 * @param {string} params.resourceType - Cloudinary resource type (RESOURCE_TYPES.IMAGE or RESOURCE_TYPES.VIDEO)
 */
export const deleteUploadedFile = async ({
  modelInstance,
  field,
  resourceType = RESOURCE_TYPES.IMAGE,
}) => {
  // Safeguard: Check if the model instance exists
  if (!modelInstance) {
    const error = new Error("Target model record not found.");
    error.statusCode = 404;
    throw error;
  }

  const uploadedFile = modelInstance[field];

  // Safeguard: Check if the subfield and its publicId exist
  if (!uploadedFile || !uploadedFile.publicId) {
    const error = new Error("Uploaded file reference or public ID not found.");
    error.statusCode = 404;
    throw error;
  }

  // Delete the asset from Cloudinary cloud storage
  await deleteFromCloudinary(uploadedFile.publicId, resourceType);

  // Clear the field reference and update the database
  modelInstance[field] = null;
  await modelInstance.save();

  return modelInstance;
};