import cloudinary from "cloudinary";
const v2 = cloudinary.v2;
import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.CLOUDINARY_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are missing.");
}
v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = v2.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// FIXED: Added resourceType option to accept variations (image, video, raw)
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return null;
  return await v2.uploader.destroy(publicId, { resource_type: resourceType });
};

// FIXED: Internal call to deleteFromCloudinary now forwards the proper resourceType
export const replaceUploadedFile = async ({
  oldPublicId,
  file,
  folder,
  resourceType = "auto",
}) => {

  if (oldPublicId) {
    const deletionType =
      resourceType === "auto" ? "image" : resourceType;

    await deleteFromCloudinary(oldPublicId, deletionType);
  }

  return await uploadToCloudinary(file.buffer, folder);
};

export const generateThumbnailUrl = (imageUrl, width = 300, height = 300) => {
  return imageUrl.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill/`
  );
};

// FIXED: Bundled everything into a custom service object to safely freeze it
const cloudinaryService = {
  upload: uploadToCloudinary,
  delete: deleteFromCloudinary,
  replace: replaceUploadedFile,
  thumbnail: generateThumbnailUrl,
};
export {v2};
export default Object.freeze(cloudinaryService);
