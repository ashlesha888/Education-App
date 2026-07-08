import {
  generateThumbnailUrl,
} from "./cloudinaryHelper.js";



export const formatUploadedFile = (
  uploadResult
) => {

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


export const getFileMetadata = (
  uploadedFile
) => {

  if (!uploadedFile) {

    const error =
      new Error(
        "File metadata not found."
      );

    error.statusCode = 404;

    throw error;
  }

  return {

url:
uploadedFile.url,

thumbnail:

uploadedFile.RESOURCE_TYPES.IMAGE

? generateThumbnailUrl(
uploadedFile.url
)

: null,

publicId:
uploadedFile.publicId,

format:
uploadedFile.format,

size:
uploadedFile.size,

duration:
uploadedFile.duration||
null,

};

};

export const formatFileSize = (
  bytes
) => {

  if (bytes < 1024) {
    return `${bytes} Bytes`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(2)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(2)} MB`;

};

export const buildMetadataResponse = (
  file
) => {

  return {
    success: true,
    metadata:
      getFileMetadata(file),
  };

};

/**
 * Format Multiple Files
 */
export const formatUploadedFiles =
(
uploadResults
)=>{

return uploadResults.map(

(result)=>

formatUploadedFile(
result
)

);

};