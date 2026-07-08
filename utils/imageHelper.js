import sharp from "sharp";

/**
 * Compress Image
 */
export const compressImage =
  async (
    fileBuffer,
    mimeType
  ) => {

    const image =
      sharp(fileBuffer);

    switch (mimeType) {

      case "image/png":

        return await image
          .png({
            quality: 80,
          })
          .toBuffer();

      case "image/webp":

        return await image
          .webp({
            quality: 80,
          })
          .toBuffer();

      default:

        return await image
          .jpeg({
            quality: 80,
          })
          .toBuffer();

    }

};