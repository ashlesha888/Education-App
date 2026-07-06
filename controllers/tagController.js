import {
    createTag, getTagById,
    getAllTags, validateCreateTag, validateDeleteTag,
    validateGetAllTags,
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
        const { tagId } =
            req.params;

        validateDeleteTag(
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


