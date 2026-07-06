import {
    validatePagination,
} from "./searchHelper.js";
import mongoose from "mongoose";
import Tag from "../models/Tag.js";
import {
    TAG_LIMITS,
    TAG_MESSAGES,
} from "../config/constants.js";


export const validateCreateTag = async ({
    name,
    description,
}) => {
    validateTagName(name);
    validateTagDescription(description);

    await checkDuplicateTag(name);
};


export const validateUpdateTag = async (
    tagId,
    {
        name,
        description,
    }
) => {
    validateObjectId(tagId);

    if (name) {
        validateTagName(name);

        await checkDuplicateTag(
            name,
            tagId
        );
    }

    if (description) {
        validateTagDescription(
            description
        );
    }
};


export const validateDeleteTag = (tagId) => {
    validateObjectId(tagId);
};

export const validateTagName = (name) => {
    if (!name?.trim()) {
        const error =
            new Error(
                "Tag name is required."
            );

        error.statusCode = 400;

        throw error;
    }

    const tagName =
        name
            .trim()
            .replace(
                /\s+/g,
                " "
            );

    if (
        tagName.length <
        TAG_LIMITS.MIN_NAME_LENGTH
    ) {
        const error =
            new Error(
                `Tag name must contain at least ${TAG_LIMITS.MIN_NAME_LENGTH} characters.`
            );

        error.statusCode = 400;

        throw error;
    }

    if (
        tagName.length >
        TAG_LIMITS.MAX_NAME_LENGTH
    ) {
        const error =
            new Error(
                `Tag name cannot exceed ${TAG_LIMITS.MAX_NAME_LENGTH} characters.`
            );

        error.statusCode = 400;

        throw error;
    }
};


export const validateTagDescription = (description) => {
    if (
        !description?.trim()
    ) {
        const error =
            new Error(
                "Tag description is required."
            );

        error.statusCode = 400;

        throw error;
    }

    const value =
        description.trim();

    if (
        value.length <
        TAG_LIMITS.MIN_DESCRIPTION_LENGTH
    ) {
        const error =
            new Error(
                `Description must contain at least ${TAG_LIMITS.MIN_DESCRIPTION_LENGTH} characters.`
            );

        error.statusCode = 400;

        throw error;
    }

    if (
        value.length >
        TAG_LIMITS.MAX_DESCRIPTION_LENGTH
    ) {
        const error =
            new Error(
                `Description cannot exceed ${TAG_LIMITS.MAX_DESCRIPTION_LENGTH} characters.`
            );

        error.statusCode = 400;

        throw error;
    }
};


export const validateObjectId = (id) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            id
        )
    ) {
        const error =
            new Error(
                "Invalid Tag ID."
            );

        error.statusCode = 400;

        throw error;
    }
};


export const checkDuplicateTag = async (
    name,
    excludeId = null
) => {
    const filter = {
        name: new RegExp(
            `^${name.trim()}$`,
            "i"
        ),
    };

    if (excludeId) {
        filter._id = {
            $ne: excludeId,
        };
    }

    const tag =
        await Tag.findOne(filter);

    if (tag) {
        const error =
            new Error(
                TAG_MESSAGES.ALREADY_EXISTS
            );

        error.statusCode = 409;

        throw error;
    }
};


export const escapeRegex = (text) =>
    text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

export const createTag = async ({
    name,
    description,
}) => {
    const tag =
        await Tag.create({
            name: name
                .trim()
                .replace(
                    /\s+/g,
                    " "
                ),

            description:
                description.trim(),
        });

    return formatTag(tag);
};

export const findTagById = async (tagId) => {
    const tag =
        await Tag.findById(
            tagId
        ).lean();

    return tag
        ? formatTag(tag)
        : null;
};


export const formatTag = (tag) => ({
    _id: tag._id,

    name: tag.name,

    description:
        tag.description,

    usageCount:
        tag.usageCount ?? 0,

    createdAt:
        tag.createdAt,

    updatedAt:
        tag.updatedAt,
});

export const formatTags = (tags) =>
    tags.map(
        formatTag
    );


export const getAllTags = async ({
    page = 1,
    limit = 10,
    search = "",
} = {}) => {

    const pagination =
        buildPaginationQuery(
            page,
            limit
        );

    const filter = {};

    if (
        search &&
        search.trim()
    ) {
        filter.$or = [
            {
                name: {
                    $regex:
                        search.trim(),
                    $options: "i",
                },
            },
            {
                description: {
                    $regex:
                        search.trim(),
                    $options: "i",
                },
            },
        ];
    }

    const tags =
        await Tag.find(filter)
            .sort({
                usageCount: -1,
                name: 1,
            })
            .skip(
                pagination.skip
            )
            .limit(
                pagination.limit
            )
            .lean();

    const totalTags =
        await Tag.countDocuments(
            filter
        );

    return {
        tags:
            formatTags(tags),

        pagination: {
            page,

            limit,

            totalTags,

            totalPages:
                Math.ceil(
                    totalTags /
                    limit
                ),
        },
    };
};


export const validateGetAllTags = (query) => {
    validatePagination(
        query.page,
        query.limit
    );
};

 
export const getTagById = async (tagId) => {
    const tag =
        await Tag.findById(
            tagId
        )
            .select(
                "name description usageCount createdAt updatedAt"
            )
            .lean();
    if (!tag) {
        const error =
            new Error(
                TAG_MESSAGES.NOT_FOUND
            );

        error.statusCode = 404;

        throw error;
    }

    return formatTag(tag);
};
