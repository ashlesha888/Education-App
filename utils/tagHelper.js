import {
    validatePagination,
} from "./searchHelper.js";
import mongoose from "mongoose";
import Tag from "../models/Tag.js";
import {
    TAG_LIMITS,
    TAG_MESSAGES,
} from "../config/constants.js";
import Course from "../models/Course.js";

import { escapeRegex } from "./searchHelper.js";

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


export const validateGetTagById = (tagId) => {
    validateObjectId(
        tagId
    );
};

export const updateTag = async (
    tagId,
    {
        name,
        description,
    }
) => {
    const updatedTag =
        await Tag.findByIdAndUpdate(
            tagId,
            {
                $set: {
                    ...(name !==
                        undefined && {
                        name: name
                            .trim()
                            .replace(
                                /\s+/g,
                                " "
                            ),
                    }),

                    ...(description !==
                        undefined && {
                        description:
                            description.trim(),
                    }),
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).select(
            "name description usageCount createdAt updatedAt"
        )
            .lean();

    if (!updatedTag) {
        const error =
            new Error(
                TAG_MESSAGES.NOT_FOUND
            );

        error.statusCode = 404;

        throw error;
    }

    return formatTag(
        updatedTag
    );
};

export const deleteTag = async (tagId) => {

    const tag =
        await Tag.findById(
            tagId
        );

    if (!tag) {
        const error =
            new Error(
                TAG_MESSAGES.NOT_FOUND
            );

        error.statusCode = 404;

        throw error;
    }


    if (
        await isTagUsed(tagId)
    ) {
        const error =
            new Error(
                "Cannot delete tag because it is assigned to one or more courses."
            );

        error.statusCode = 400;

        throw error;
    }
    const deletedTag =
        formatTag(tag);

    await tag.deleteOne();

    return deletedTag;
};


export const isTagUsed = async (tagId) => {
    return await Course.exists({ tags: tagId, });
};

export const getTrimmedParam = (req, key) => req.params[key]?.trim();


export const getCoursesByTag = async (
    tagId,
    {
        page = 1,
        limit = 10,
    } = {}
) => {

    const pagination =
        buildPaginationQuery(
            page,
            limit
        );
    const filter = {
        tags: tagId,
        status:
        COURSE_STATUS.PUBLISHED,
    };

    const courses =
        Course.find(filter)
            .populate({
                path: "instructor",
                select:
                    "firstName lastName profileImage",
            })
            .sort({
                averageRating:-1,
                totalStudentsEnrolled:-1,
                createdAt:-1,
            })
            .skip(
                pagination.skip
            )
            .limit(
                pagination.limit
            )
            .lean();

    const totalCourses =
        Course.countDocuments(filter);

    return {
        courses,

        pagination: {
            page:
                pagination.page,

            limit:
                pagination.limit,

            totalCourses,

            totalPages:
                Math.ceil(
                    totalCourses /
                    pagination.limit
                ),
        },
    };
};

export const findExistingTag = async (tagId) => {
  const tag = await Tag.findById(tagId);
  if (!tag) {
    const error = new Error(TAG_MESSAGES.NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }
  return tag;
};

export const addTagToCourse = async (courseId, tagId) => {
  const course = await Course.findById(courseId);
  if (!course) {
   throw new NotFoundError(
  "Course not found."
);
  }

  await findExistingTag(tagId);

  if (course.tags.some((id) => id.toString() === tagId.toString())) {
    return formatCourseCard(course);
  }

  course.tags.push(tagId);
  await course.save();

  await Tag.findByIdAndUpdate(tagId, {
    $inc: { usageCount: 1 },
  });

  return formatCourseCard(course);
};

export const validateCourseTagMapping =
({
  courseId,
  tagId,
}) => {

  validateObjectId(
    courseId
  );

  validateObjectId(
    tagId
  );
};

export const findExistingCourse = async (courseId) => {

  const course =
    await Course.findById(
      courseId
    );

  if (!course) {
    const error =
      new Error(
        "Course not found."
      );

    error.statusCode = 404;

    throw error;
  }

  return course;
};

export const removeTagFromCourse = async (courseId, tagId) => {
  const course = await findExistingCourse(courseId);
  await findExistingTag(tagId);

  if (!isTagAssignedToCourse(course, tagId)) {
    const error = new Error("Tag is not assigned to this course.");
    error.statusCode = 400;
    throw error;
  }

  course.tags = removeTagId(course.tags, tagId);
  await course.save();

  const tag = await Tag.findById(tagId);
  if (tag && tag.usageCount > 0) {
    tag.usageCount--;
    await tag.save();
  }

  return formatCourseCard(course);
};

export const isTagAssignedToCourse =
(
  course,
  tagId
) => {

  return course.tags.some(
    (id) =>
      id.toString() ===
      tagId.toString()
  );
};

export const removeTagId =
(
  tags,
  tagId
) => {

  return tags.filter(
    (id) =>
      id.toString() !==
      tagId.toString()
  );
};

export const replaceCourseTags = async (courseId, tagIds = []) => {
  const course = await findExistingCourse(courseId);

  const uniqueTagIds = [...new Set(tagIds.map((id) => id.toString()))];

  const oldTags = course.tags.map((id) => id.toString());

  const tagsToRemove = oldTags.filter((id) => !uniqueTagIds.includes(id));
  const tagsToAdd = uniqueTagIds.filter((id) => !oldTags.includes(id));

  if (tagsToAdd.length > 0) {
    await Promise.all(tagsToAdd.map((id) => findExistingTag(id)));
  }

  course.tags = uniqueTagIds;
  await course.save();

  if (tagsToRemove.length > 0) {
    await Tag.updateMany(
      { _id: { $in: tagsToRemove }, usageCount: { $gt: 0 } },
      { $inc: { usageCount: -1 } }
    );
  }

  if (tagsToAdd.length > 0) {
    await Tag.updateMany(
      { _id: { $in: tagsToAdd } },
      { $inc: { usageCount: 1 } }
    );
  }

  return formatCourseCard(course);
};

export const validateReplaceCourseTags = (courseId, tagIds) => {
  validateObjectId(courseId);

  if (!Array.isArray(tagIds)) {
    const error = new Error("Tag IDs must be an array.");
    error.statusCode = 400;
    throw error;
  }

  if (tagIds.length === 0) {
    const error = new Error("At least one tag ID is required.");
    error.statusCode = 400;
    throw error;
  }

  tagIds.forEach((id) => validateObjectId(id));
};

export const getPopularTags = async (limit = 10) => {
  return await Tag.find({ usageCount: { $gt: 0 } })
    .sort({ usageCount: -1, name: 1 })
    .limit(Number(limit))
    .select("name usageCount")
    .lean();
};

export const validatePopularTags =(query) => {

  validatePagination(
    query
  );

};

export const getTagStatistics = async () => {
  const result = await Tag.aggregate([
    {
      $group: {
        _id: null,
        totalTags: { $sum: 1 },
        totalUsage: { $sum: "$usageCount" },
        avgUsage: { $avg: "$usageCount" },
        maxUsage: { $max: "$usageCount" },
      },
    },
    {
      $project: {
        _id: 0,
        totalTags: 1,
        totalUsage: 1,
        avgUsage: { $round: ["$avgUsage", 2] },
        maxUsage: 1,
      },
    },
  ]);

  return (
    result[0] || {
      totalTags: 0,
      totalUsage: 0,
      avgUsage: 0,
      maxUsage: 0,
    }
  );
};

export const searchTags = async (query = "", page = 1, limit = 10) => {
  const trimmedQuery = query.trim();
  const filter = trimmedQuery
    ? { name: { $regex: trimmedQuery, $options: "i" } }
    : {};

  const skipIndex = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));

  const [tags, totalTags] = await Promise.all([
    Tag.find(filter)
      .sort({ name: 1 })
      .skip(skipIndex)
      .limit(Number(limit))
      .select("name usageCount")
      .lean(),
    Tag.countDocuments(filter),
  ]);

  return {
    tags,
    pagination: {
      totalTags,
      currentPage: Number(page),
      totalPages: Math.ceil(totalTags / Number(limit)),
    },
  };
};

export const validateSearchKeyword =
(
  keyword
) => {

  if (
    !keyword ||
    !keyword.trim()
  ) {
    const error =
      new Error(
        "Search keyword is required."
      );

    error.statusCode = 400;

    throw error;
  }

  if (
    keyword.length > 100
  ) {
    const error =
      new Error(
        "Search keyword is too long."
      );

    error.statusCode = 400;

    throw error;
  }
};