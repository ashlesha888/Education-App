import multer from "multer";
import {
  FILE_LIMITS,
  FILE_UPLOAD_LIMITS,
} from "../config/constants.js";

const storage = multer.memoryStorage();

export const createUploader = ({
  fileSize,
  files = 1,
}) => {

  const uploader = multer({

    storage,

    limits:{

      fileSize,

      files,

    },

  });

  return {

    single:(field)=>
      uploader.single(field),

    array:(field)=>
      uploader.array(
        field,
        files
      ),

    fields:(fields)=>
      uploader.fields(fields),

  };

};

export const uploadImage =
Object.freeze(

createUploader({

fileSize:
FILE_LIMITS.IMAGE,

files:
FILE_UPLOAD_LIMITS.MAX_IMAGES,

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