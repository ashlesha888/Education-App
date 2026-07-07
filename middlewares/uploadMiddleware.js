import multer from "multer";
import { FILE_LIMITS } from "../config/constants.js";

const storage = multer.memoryStorage();

export const createUploader = ({
  fileSize,
  files = 1,
}) => {
  return multer({
    storage,
    limits: {
      fileSize,
      files,
    },
  });
};

export const uploadImage = Object.freeze(
  createUploader({
    fileSize: FILE_LIMITS.IMAGE,
  })
);

export const uploadVideo = Object.freeze(
  createUploader({
    fileSize: FILE_LIMITS.VIDEO,
  })
);

export const uploadDocument = Object.freeze(
  createUploader({
    fileSize: FILE_LIMITS.DOCUMENT,
  })
);