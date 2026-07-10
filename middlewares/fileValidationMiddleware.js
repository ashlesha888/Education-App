import {
  IMAGE_TYPES,
  VIDEO_TYPES,
} from "../config/constants.js";

export const validateUploadedFile = ({
  required = true,
  allowedTypes = [],
  maxSize,
}) => {

  return (
    req,
    res,
    next
  ) => {

    const file = req.file;

    if (!file) {

      if (required) {

        return res.status(400).json({

          success: false,

          message: "File is required.",

        });

      }

      return next();

    }

    if (
      !allowedTypes.includes(
        file.mimetype
      )
    ) {

      return res.status(400).json({

        success: false,

        message: "Invalid file type.",

      });

    }

    if (
      file.size > maxSize
    ) {

      return res.status(400).json({

        success: false,

        message: "File size exceeds limit.",

      });

    }

    next();

  };

};
