import multer from "multer";
import { FILE_LIMITS } from "./config/constants.js";

const storage =
    multer.memoryStorage();

const upload =multer({
        storage,

        limits: {
            fileSize:
            FILE_LIMITS.IMAGE
        }
});

export default Object.freeze(
  upload
);



const storage = multer.memoryStorage();


export const createUploader = ({
  fileSize,
}) => {
  return multer({
    storage,

    limits: {
      fileSize,
    },
  });
};

export const uploadImage = createUploader({
fileSize:
    FILE_LIMITS.IMAGE,
});

export const uploadVideo = createUploader({
    fileSize:
      FILE_LIMITS.VIDEO,
});

export const uploadDocument = createUploader({
fileSize:
    FILE_LIMITS.DOCUMENT,
});