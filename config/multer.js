import multer from "multer";
import { MAX_TOTAL_UPLOAD_SIZE, MIME_TYPES } from "./constants.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    ...MIME_TYPES.IMAGE,
    ...MIME_TYPES.VIDEO,
    ...MIME_TYPES.DOCUMENT,
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Upload rejected.`), false); // Reject file
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_TOTAL_UPLOAD_SIZE,
  },
  fileFilter,
});

export default upload;
