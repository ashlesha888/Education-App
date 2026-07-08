export const MINIMUM_PROGRESS_FOR_REVIEW = 20;
export const MINIMUM_RATINGS_FOR_TOP_COURSE = 5;

export const COURSE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
};

export const ACCOUNT_TYPE = {
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
  ADMIN: "Admin",
};

export const SEARCH_SORT = {
  LATEST: "latest",
  OLDEST: "oldest",
  RATING: "rating",
  POPULARITY: "popularity",
  PRICE_ASC: "priceAsc",
  PRICE_DESC: "priceDesc",
  ALPHABETICAL: "alphabetical",
  DURATION: "duration",
};

export const SEARCH_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  SUGGESTION_LIMIT: 10,
  RECENT_SEARCH_LIMIT: 10,
};

export const SEARCH_MESSAGES = {
  COURSES_FETCHED: "Courses fetched successfully.",
  INSTRUCTORS_FETCHED: "Instructors fetched successfully.",
  CATEGORIES_FETCHED: "Categories fetched successfully.",
  GLOBAL_SEARCH: "Global search completed successfully.",
  SEARCH_SUGGESTIONS: "Search suggestions fetched successfully.",
};

export const TAG_LIMITS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 300,
};

export const TAG_MESSAGES = {
  CREATED: "Tag created successfully.",
  UPDATED: "Tag updated successfully.",
  DELETED: "Tag deleted successfully.",
  FETCHED: "Tag fetched successfully.",
  FETCHED_ALL: "Tags fetched successfully.",
  ALREADY_EXISTS: "Tag already exists.",
  NOT_FOUND: "Tag not found.",
};

// --- FILE UPLOAD & CLOUDINARY CONFIGURATIONS ---

export const FILE_LIMITS = {
  IMAGE: 5 * 1024 * 1024,      // 5MB
  VIDEO: 200 * 1024 * 1024,   // 200MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
};

export const FILE_UPLOAD_LIMITS = {
  MAX_IMAGES: 5,
  MAX_DOCUMENTS: 10,
  MAX_VIDEOS: 2,
};

export const MAX_TOTAL_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB

export const UPLOAD_TYPES = {
  IMAGE: { fileSize: FILE_LIMITS.IMAGE },
  VIDEO: { fileSize: FILE_LIMITS.VIDEO },
  DOCUMENT: { fileSize: FILE_LIMITS.DOCUMENT },
};

export const MIME_TYPES = {
  IMAGE: ["image/jpeg", "image/png", "image/webp"],
  VIDEO: ["video/mp4", "video/webm", "video/quicktime"],
  DOCUMENT: ["application/pdf"],
};

export const RESOURCE_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  AUTO: "auto",
};

export const CLOUDINARY_FOLDERS = {
  COURSE_THUMBNAILS: "course-thumbnails",
  PROFILE_IMAGES: "profile-images",
  LECTURE_VIDEOS: "lecture-videos",
};

export const FILE_FIELDS = {
  COURSE_THUMBNAIL: "thumbnail",
  PROFILE_IMAGE: "profileImage",
  LECTURE_VIDEO: "lectureVideo",
};

export const IMAGE_COMPRESSION = {
  QUALITY: 80,
  ENABLED: true,
};

export const THUMBNAIL = {
  WIDTH: 300,
  HEIGHT: 300,
};

export const COURSE_STATUS = Object.freeze({
  DRAFT: "Draft",
  PUBLISHED: "Published",
});