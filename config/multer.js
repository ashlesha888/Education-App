import multer from "multer";
import { MAX_TOTAL_UPLOAD_SIZE, MIME_TYPES } from "./constants.js"; // Adjust path as needed

const storage = multer.memoryStorage();

// Centralized file type validation using your application constants
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
    fileSize: MAX_TOTAL_UPLOAD_SIZE, // Protects your RAM from OOM crashes (50MB from constants)
  },
  fileFilter,
});

export default upload;
