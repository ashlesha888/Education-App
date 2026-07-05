import {
    SEARCH_PAGINATION, SEARCH_SORT, COURSE_STATUS, ACCOUNT_TYPE,
} from "../config/constants.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/Category.js";

export const buildCourseQuery = (
    queryParams
) => {
    const {
        search,
        category,
        tag,
        instructor,
        language,
        level,
        published,
        minPrice,
        maxPrice,
        minRating,
    } = queryParams;

    const query = {};

    if (
        search &&
        search.trim()
    ) {
        query.$or = [
            {
                courseName: {
                    $regex: search.trim(),
                    $options: "i",
                },
            },
            {
                courseDescription: {
                    $regex: search.trim(),
                    $options: "i",
                },
            },
        ];
    }

    if (category) {
        query.category = category;
    }

    if (tag) {
        query.tags = {
            $in: [tag],
        };
    }

    if (instructor) {
        query.instructor =
            instructor;
    }

    if (language) {
        query.language =
            language;
    }

    if (level) {
        query.level = level;
    }

    if (
        published !==
        undefined
    ) {
        query.status =
            published === "true"
                ? COURSE_STATUS.PUBLISHED
                : COURSE_STATUS.DRAFT;
    }

    if (
        minPrice ||
        maxPrice
    ) {
        query.price = {};

        if (minPrice) {
            query.price.$gte =
                Number(minPrice);
        }

        if (maxPrice) {
            query.price.$lte =
                Number(maxPrice);
        }
    }

    if (minRating) {
        query.averageRating = {
            $gte: Number(
                minRating
            ),
        };
    }

    return query;
};

export const buildSortQuery = (
    sort
) => {
    switch (sort) {
        case SEARCH_SORT.RATING:
            return {
                averageRating: -1,
            };

        case SEARCH_SORT.LATEST:
            return {
                createdAt: -1,
            };

        case SEARCH_SORT.OLDEST:
            return {
                createdAt: 1,
            };

        case SEARCH_SORT.POPULARITY:
            return {
                totalStudentsEnrolled: -1,
            };

        case SEARCH_SORT.PRICE_ASCT:
            return {
                price: 1,
            };

        case SEARCH_SORT.PRICE_DESC:
            return {
                price: -1,
            };

        case SEARCH_SORT.ALPHABETICAL:
            return {
                courseName: 1,
            };

        case SEARCH_SORT.DURATION:
            return {
                totalDuration: -1,
            };

        default:
            return {
                createdAt: -1,
            };
    }
};

export const buildPaginationQuery = (
    page =
        SEARCH_PAGINATION.DEFAULT_PAGE,

    limit =
        SEARCH_PAGINATION.DEFAULT_LIMIT
) => {
    const currentPage =
        Math.max(
            Number(page) || 1,
            1
        );

    const pageSize =
        Math.min(
            Math.max(
                Number(limit) || 10,
                1
            ),
            SEARCH_PAGINATION.MAX_LIMIT
        );

    return {
        page: currentPage,
        limit: pageSize,
        skip:
            (currentPage - 1) *
            pageSize,
    };
};

export const buildPaginationQuery = (
    page =
        SEARCH_PAGINATION.DEFAULT_PAGE,

    limit =
        SEARCH_PAGINATION.DEFAULT_LIMIT
) => {
    const currentPage = Math.max(
        Number(page) || 1,
        1
    );

    const pageSize = Math.min(
        Math.max(
            Number(limit) || 10,
            1
        ),
        SEARCH_PAGINATION.MAX_LIMIT
    );

    return {
        page: currentPage,
        limit: pageSize,
        skip:
            (currentPage - 1) *
            pageSize,
    };
};

export const searchCourses = async (
    queryParams
) => {
    const filter =
        buildCourseQuery(
            queryParams
        );

    const sort =
        buildSortQuery(
            queryParams.sort
        );

    const pagination =
        buildPaginationQuery(
            queryParams.page,
            queryParams.limit
        );

    const courses =
        await Course.find(filter)
            .populate(
                "instructor",
                "firstName lastName profileImage"
            )
            .populate(
                "category",
                "name"
            )
            .populate(
                "tag",
                "name"
            )
            .sort(sort)
            .skip(
                pagination.skip
            )
            .limit(
                pagination.limit
            )
            .lean();

    const totalCourses =
        await Course.countDocuments(
            filter
        );

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

export const validateSearchQuery = (
    query
) => {
    validatePagination(
        query.page,
        query.limit
    );

    validateSortOption(
        query.sort
    );
    validatePriceRange(
        query.minPrice,
        query.maxPrice
    );

    validateRating(
        query.minRating
    );
    validateObjectId(
        query.category,
        "Category"
    );

    validateObjectId(
        query.tag,
        "Tag"
    );

    validateObjectId(
        query.instructor,
        "Instructor"
    );
};

export const validatePagination = (
    page,
    limit
) => {
    if (
        page &&
        (
            isNaN(page) ||
            Number(page) < 1
        )
    ) {
        const error =
            new Error(
                "Invalid page number."
            );

        error.statusCode = 400;

        throw error;
    }

    if (
        limit &&
        (
            isNaN(limit) ||
            Number(limit) < 1 ||
            Number(limit) >
            SEARCH_PAGINATION.MAX_LIMIT
        )
    ) {
        const error =
            new Error(
                `Limit must be between 1 and ${SEARCH_PAGINATION.MAX_LIMIT}.`
            );

        error.statusCode = 400;

        throw error;
    }
};

export const validateSortOption = (
    sort
) => {
    if (!sort) {
        return;
    }

    const validSorts =
        Object.values(
            SEARCH_SORT
        );

    if (
        !validSorts.includes(
            sort
        )
    ) {
        const error =
            new Error(
                "Invalid sort option."
            );

        error.statusCode = 400;

        throw error;
    }
};

export const validatePriceRange = (
    minPrice,
    maxPrice
) => {
    if (
        minPrice &&
        isNaN(minPrice)
    ) {
        const error =
            new Error(
                "Minimum price must be a number."
            );

        error.statusCode = 400;

        throw error;
    }

    if (
        maxPrice &&
        isNaN(maxPrice)
    ) {
        const error =
            new Error(
                "Maximum price must be a number."
            );

        error.statusCode = 400;

        throw error;
    }

    if (
        minPrice &&
        maxPrice &&
        Number(minPrice) >
        Number(maxPrice)
    ) {
        const error =
            new Error(
                "Minimum price cannot be greater than maximum price."
            );

        error.statusCode = 400;

        throw error;
    }
};

export const validateRating = (
    minRating
) => {
    if (
        minRating === undefined
    ) {
        return;
    }

    if (
        isNaN(minRating)
    ) {
        const error =
            new Error(
                "Minimum rating must be a number."
            );

        error.statusCode = 400;

        throw error;
    }

    const rating =
        Number(minRating);

    if (
        rating < 0 ||
        rating > 5
    ) {
        const error =
            new Error(
                "Minimum rating must be between 0 and 5."
            );

        error.statusCode = 400;

        throw error;
    }
};

export const validateObjectId = (
    value,
    fieldName
) => {
    if (
        !value
    ) {
        return;
    }

    if (
        !mongoose.Types.ObjectId.isValid(
            value
        )
    ) {
        const error =
            new Error(
                `${fieldName} is not a valid ObjectId.`
            );

        error.statusCode = 400;

        throw error;
    }
};

export const globalSearch = async (
    search
) => {
    if (
        !search ||
        !search.trim()
    ) {
        return {
            courses: [],
            instructors: [],
            categories: [],
        };
    }

    const keyword =
        search.trim();

    const [
        courses,
        instructors,
        categories,
    ] = await Promise.all([
        Course.find({
            status:
                COURSE_STATUS.PUBLISHED,

            $or: [
                {
                    courseName: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
                {
                    courseDescription: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
            ],
        })
            .select(
                "courseName thumbnail averageRating price"
            )
            .limit(5)
            .lean(),

        User.find({
            accountType:
                ACCOUNT_TYPE.INSTRUCTOR,
            $or: [
                {
                    firstName: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
                {
                    lastName: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
            ],
        })
            .select(
                "firstName lastName profileImage"
            )
            .limit(5)
            .lean(),

        Category.find({
            name: {
                $regex: keyword,
                $options: "i",
            },
        })
            .select(
                "name description"
            )
            .limit(5)
            .lean(),
    ]);

    return {
        courses,
        instructors,
        categories,
    };
};

export const validateKeyword =
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
    keyword.trim().length <
    2
  ) {
    const error =
      new Error(
        "Search keyword must contain at least 2 characters."
      );

    error.statusCode = 400;

    throw error;
  }
};


