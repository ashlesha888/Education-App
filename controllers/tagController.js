import {
  createTag,validateCreateTag,
} from "../utils/tagHelper.js";

import {
  TAG_MESSAGES,
} from "../config/constants.js";

/**
 * Create Tag
 */
export const createTagController = async (req, res) => {
    try {
      const {
        name,
        description,
      } = req.body;

      const normalizedData = {
  name:
    name?.trim(),

  description:
    description?.trim(),
};

await validateCreateTag(
  normalizedData
);

      const tag =
       await createTag(
  normalizedData
);

      return res.status(201).json({
        success: true,

        message:
          TAG_MESSAGES.CREATED,

        data: {
          tag,
        },
      });

    } catch (error) {
      console.error(error);

      return res.status(
        error.statusCode || 500
      ).json({
        success: false,

        message:
          error.message ||
          "Internal Server Error",
      });
    }
  };