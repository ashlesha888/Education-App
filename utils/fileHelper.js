export const validateUploadedFile = (file) => {
  if (!file) {
    const error = new Error("No file uploaded.");
    error.statusCode = 400;
    throw error;
  }

  if (!file.mimetype.startsWith("image/")) {
    const error = new Error("Invalid file type. Only images are allowed.");
    error.statusCode = 400;
    throw error;
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    const error = new Error("File size limit exceeded. Maximum size allowed is 5MB.");
    error.statusCode = 400;
    throw error;
  }
};

export const validateMimeType = (
  file,
  allowedMimeTypes
) => {

  if (
    !allowedMimeTypes.includes(
      file.mimetype
    )
  ) {
    const error = new Error(
      "Unsupported file type."
    );

    error.statusCode = 400;

    throw error;
  }

  return true;
};


export const validateFile = (
  file,
  allowedMimeTypes
) => {

  validateUploadedFile(
    file
  );

  validateMimeType(
    file,
    allowedMimeTypes
  );

  return true;
};