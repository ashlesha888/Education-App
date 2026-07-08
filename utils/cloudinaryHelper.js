import cloudinary from "../config/cloudinary.js";
import {
  compressImage,
} from "./imageHelper.js";
/**
 * Upload file to Cloudinary
 */
export const uploadToCloudinary = async (
  file,
  folder,
  resourceType = "auto"
) => {
  try {
    const result = await new Promise(
      (resolve, reject) => {

        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type:
                resourceType,

              quality: "auto",
              fetch_format: "auto",
            },

            (error, result) => {

              if (error) {
                return reject(error);
              }

              resolve(result);
            }
          );

        let buffer =
  file.buffer;

if (
  resourceType ===
  "image"
) {

  buffer =
    await compressImage(
      file.buffer,
      file.mimetype
    );

}

uploadStream.end(
  buffer
);

      }
    );

    return result;

  } catch (error) {

    const uploadError =
      new Error(
        "Cloudinary upload failed."
      );

    uploadError.statusCode = 500;

    throw uploadError;
  }
};
/**
 * Delete file from Cloudinary
 */


/**
 * Upload Multiple Files
 */
export const uploadMultipleFiles =
async(

files,

folder,

resourceType

)=>{

const uploads =
files.map(

(file)=>

uploadToCloudinary(

file,

folder,

resourceType

)

);

const results =
await Promise.all(
uploads
);

return results;

};


export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {

  try {

    return await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type:
          resourceType,
      }
    );

  } catch (error) {

    const deleteError =
      new Error(
        "Cloudinary delete failed."
      );

    deleteError.statusCode = 500;

    throw deleteError;
  }
};
export const buildUploadOptions = (
  folder,
  resourceType,
  transformations = {}
) => {

  return {
    public_id:
`${Date.now()}-${Math.random()
    .toString(36)
    .substring(2,10)}`,
    folder,

    resource_type:
      resourceType,

    quality: "auto",

    fetch_format: "auto",
    ...transformations,
  };

};
