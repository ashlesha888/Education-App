
import {
  SEARCH_PAGINATION,SEARCH_SORT,COURSE_STATUS,
} from "../config/constants.js";

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


import Course from "../models/Course.js";
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



