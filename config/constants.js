export const MINIMUM_PROGRESS_FOR_REVIEW = 20;
export const MINIMUM_RATINGS_FOR_TOP_COURSE = 5;
export const COURSE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED:
    "Published",
};

export const SEARCH_SORT = {
  LATEST: "latest",

  OLDEST: "oldest",

  RATING: "rating",

  POPULARITY:
    "popularity",

  PRICE_ASC:
    "priceAsc",

  PRICE_DESC:
    "priceDesc",

  ALPHABETICAL:
    "alphabetical",

  DURATION:
    "duration",
};

export const SEARCH_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const ACCOUNT_TYPE = {
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
  ADMIN: "Admin",
};

export const SEARCH_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  SUGGESTION_LIMIT: 10,
  RECENT_SEARCH_LIMIT: 10,
};

export const SEARCH_MESSAGES = {
  COURSES_FETCHED:
    "Courses fetched successfully.",

  INSTRUCTORS_FETCHED:
    "Instructors fetched successfully.",

  CATEGORIES_FETCHED:
    "Categories fetched successfully.",

  GLOBAL_SEARCH:
    "Global search completed successfully.",

  SEARCH_SUGGESTIONS:
    "Search suggestions fetched successfully.",
};

export const TAG_LIMITS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,

  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 300,
};

export const TAG_MESSAGES = {
  CREATED:
    "Tag created successfully.",

  UPDATED:
    "Tag updated successfully.",

  DELETED:
    "Tag deleted successfully.",

  FETCHED:
    "Tag fetched successfully.",

  FETCHED_ALL:
    "Tags fetched successfully.",

  ALREADY_EXISTS:
    "Tag already exists.",

  NOT_FOUND:
    "Tag not found.",
};

export const FILE_LIMITS = {

  IMAGE:
    5 * 1024 * 1024,

  VIDEO:
    200 * 1024 * 1024,

  DOCUMENT:
    10 * 1024 * 1024,
};