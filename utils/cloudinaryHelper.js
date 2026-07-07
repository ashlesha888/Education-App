import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (
  file,
  folder,
  resourceType = "auto"
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        quality: "auto",
        fetch_format: "auto",
        public_id: `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};