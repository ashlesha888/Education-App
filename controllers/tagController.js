import {
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag,
    getCoursesByTag,
    addTagToCourse,
    removeTagFromCourse,
    replaceCourseTags,
    findExistingTag,
    getPopularTags,
    getTagStatistics,
    searchTags,
    validateCreateTag,
    validateGetAllTags,
    validateGetTagById,
    validateUpdateTag,
    validateDeleteTag,
    validateCourseTagMapping,
    validateObjectId,
    validateReplaceCourseTags,
} from "../utils/tagHelper.js";

import {
    TAG_MESSAGES,
} from "../config/constants.js";

import { logError } from "../utils/errorHelper.js";

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

/**
 * Get All Tags
 */
export const getAllTagsController = async (req, res) => {
    try {
        const query = {
            page:
                Number(req.query.page) || 1,

            limit:
                Number(req.query.limit) || 10,

            search:
                req.query.search?.trim() || "",
        };

        validateGetAllTags(
            req.query
        );
        const result =
            await getAllTags(
                query
            );

        return res.status(200).json({
            success: true,

            message:
                TAG_MESSAGES.FETCHED_ALL,

            data: {
                tags:
                    result.tags,

                pagination:
                    result.pagination,
            },
        });

    } catch (error) {
        logError(error);

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

/**
 * Get Tag By ID
 */
export const getTagByIdController = async (req, res) => {
    try {
        const tagId =
            req.params.tagId?.trim();

        validateGetTagById(
            tagId
        );
        

        const tag =
            await getTagById(
                tagId
            );

        return res.status(200).json({
            success: true,

            message:
                TAG_MESSAGES.FETCHED,

            data: {
                tag,
            },
        });

    } catch (error) {
        logError(error);

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

/**
 * Update Tag
 */
export const updateTagController = async (req, res) => {
    try {
        const tagId =
            req.params.tagId?.trim();

        const {
            name,
            description,
        } = req.body;

        const updateData = {
            name:
                name?.trim(),

            description:
                description?.trim(),
        };
        if (
            Object.values(updateData)
                .every(
                    (value) =>
                        value === undefined
                )
        ) {
            const error =
                new Error(
                    "At least one field is required to update."
                );

            error.statusCode = 400;

            throw error;
        }

        await validateUpdateTag(
            tagId,
            updateData
        );

        const tag =
            await updateTag(
                tagId,
                updateData
            );

        return res.status(200).json({
            success: true,

            message:
                TAG_MESSAGES.UPDATED,

            data: {
                tag,
            },
        });

    } catch (error) {
        logError(error);

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

/**
 * Delete Tag
 */
export const deleteTagController = async (req, res) => {
    try {
        const tagId =
getTrimmedParam(
req,
"tagId"
);

        validateDeleteTag(
            tagId
        );

        const deletedTag =
            await deleteTag(
                tagId
            );

        return res.status(200).json({
            success: true,

            message:
                TAG_MESSAGES.DELETED,

            data: {
                tag: deletedTag,
            },
        });

    } catch (error) {
        logError(error);

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

/**
 * Get Courses By Tag
 */
export const getCoursesByTagController = async (req, res) => {
    try {
      const tagId =
        req.params.tagId?.trim();

      validateGetTagById(
        tagId
      );
      validateGetAllTags(
  req.query
);

      const query = {
        page:
          Number(req.query.page) ||
          1,

        limit:
          Number(req.query.limit) ||
          10,
      };

      const result =
        await getCoursesByTag(
          tagId,
          query
        );

      return res.status(200).json({
        success: true,

        message:
          "Courses fetched successfully.",

        data: {
          courses:
            result.courses,

          pagination:
            result.pagination,
        },
      });

    } catch (error) {
      logError(error);

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

export const addTagToCourseController = async (req, res) => {
  try {
    const { courseId, tagId } = req.body;

    validateCourseTagMapping({ courseId, tagId });

    await findExistingTag(tagId);
    const course = await addTagToCourse(courseId, tagId);

    return res.status(200).json({
      success: true,
      message: TAG_MESSAGES.TAG_ADDED_TO_COURSE,
      data: { course },
    });
  } catch (error) {
    logError(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const removeTagFromCourseController = async (req, res) => {
  try {
    const { courseId, tagId } = req.body;

    validateCourseTagMapping({ courseId, tagId });

    const course = await removeTagFromCourse(courseId, tagId);

    return res.status(200).json({
      success: true,
      message: TAG_MESSAGES.TAG_REMOVED_FROM_COURSE,
      data: { course },
    });
  } catch (error) {
    logError(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const replaceCourseTagsController = async (req, res) => {
  try {
    const { courseId, tagIds } = req.body;

    validateObjectId(courseId);
    if (!Array.isArray(tagIds)) {
      const error = new Error("Tag IDs must be an array.");
      error.statusCode = 400;
      throw error;
    }

    const course = await replaceCourseTags(courseId, tagIds);

    return res.status(200).json({
      success: true,
      message: TAG_MESSAGES.COURSE_TAGS_UPDATED,
      data: { course },
    });
  } catch (error) {
    logError(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getPopularTagsController = async (req, res) => {
  try {
    const { limit } = req.query;

    if (limit && (isNaN(limit) || Number(limit) <= 0)) {
      const error = new Error("Limit must be a positive number.");
      error.statusCode = 400;
      throw error;
    }

    const tags = await getPopularTags(limit);

    return res.status(200).json({
      success: true,
      message: TAG_MESSAGES.POPULAR_TAGS_FETCHED,
      data: { tags },
    });
  } catch (error) {
    logError(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getTagStatisticsController = async (req, res) => {
  try {
    const stats = await getTagStatistics();

    return res.status(200).json({
      success: true,
      message: TAG_MESSAGES.STATISTICS_FETCHED,
      data: { stats },
    });
  } catch (error) {
    logError(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const searchTagsController = async (req, res) => {
  try {
    const { query = "", page = 1, limit = 10 } = req.query;

    if (isNaN(page) || Number(page) <= 0) {
      const error = new Error("Page must be a positive number.");
      error.statusCode = 400;
      throw error;
    }

    if (isNaN(limit) || Number(limit) <= 0) {
      const error = new Error("Limit must be a positive number.");
      error.statusCode = 400;
      throw error;
    }

    const result = await searchTags(query, page, limit);

    return res.status(200).json({
      success: true,
      message: TAG_MESSAGES.TAGS_FETCHED,
      data: result,
    });
  } catch (error) {
    logError(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};