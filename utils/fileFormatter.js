
import { RESOURCE_TYPES } from "../config/constants.js";

/**
 * Format a single Cloudinary upload result object
 */
export const formatUploadedFile = (uploadResult) => {
  return {
    publicId: uploadResult.public_id,
    url: uploadResult.secure_url,
    resourceType: uploadResult.resource_type,
    format: uploadResult.format,
    width: uploadResult.width,
    height: uploadResult.height,
    duration: uploadResult.duration || null,
    originalFilename: uploadResult.original_filename,
    size: uploadResult.bytes,
    createdAt: uploadResult.created_at,
  };
};

/**
 * Format an array of Promise.allSettled upload results
 */
export const formatUploadedFiles = (uploadResults) => {
  return uploadResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => formatUploadedFile(result.value));
};

/**
 * Convert byte counts into human-readable strings (Bytes, KB, MB)
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} Bytes`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Extract and sanitize user-facing file metadata
 */
export const getFileMetadata = (uploadedFile) => {
  if (!uploadedFile) {
    const error = new Error("File metadata not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    url: uploadedFile.url,
    thumbnail:
  uploadedFile.resourceType === RESOURCE_TYPES.IMAGE
    ? uploadedFile.url
    : null,
    publicId: uploadedFile.publicId,
    format: uploadedFile.format,
    size: formatFileSize(uploadedFile.size),
    duration: uploadedFile.duration || null,
    originalFilename: uploadedFile.originalFilename,
  };
};

/**
 * Wrap metadata into a standard API response structure
 */
export const buildMetadataResponse = (file) => {
  return {
    success: true,
    metadata: getFileMetadata(file),
  };
};