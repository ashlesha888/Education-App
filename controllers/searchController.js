import {
  searchCourses,
  searchInstructors,
  searchCategories,
  globalSearch,
  getSearchSuggestions,  validateSearchQuery,
  validateInstructorSearch,
  validateKeyword,validateCategorySearch
} from "../utils/searchHelper.js";

import {
  SEARCH_MESSAGES,
} from "../config/constants.js";

export const searchCoursesController =async (req, res) => {
    try {
        validateSearchQuery(
    req.query
  );
      const result =
        await searchCourses(
          req.query
        );

      return res.status(200).json({
        success: true,
        message:
          "Courses fetched successfully",

    data: {
    courses:
        result.courses,

    pagination:
        result.pagination,
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

export const searchInstructorsController =async (req, res) => {
    try {
      validateInstructorSearch(
  req.query
);

      const result =
        await searchInstructors(
          req.query
        );

      return res.status(200).json({
        success: true,

        message:
          "Instructors fetched successfully.",

        data: {
          instructors:
            result.instructors,

          pagination:
            result.pagination,
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

export const searchCategoriesController =async (req, res) => {
    try {
      validateCategorySearch(
  req.query
);

      const result =
        await searchCategories(
          req.query
        );

      return res.status(200).json({
        success: true,

        message:
          "Categories fetched successfully.",

        data: {
          categories: 
            result.categories,

          pagination:
            result.pagination,
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

export const globalSearchController =async (req, res) => {
    try {
      const { search } =
        req.query;

     validateKeyword(
  search
);

      const result =
        await globalSearch(
          search
        );

      return res.status(200).json({
        success: true,
        message:
          "Global search completed successfully.",

        data: {
  ...result,

  statistics: {
    totalCourses:
      result.courses.length,

    totalInstructors:
      result.instructors.length,

    totalCategories:
      result.categories.length,
  },
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

export const getSearchSuggestionsController =
  async (req, res) => {
    try {
      const { search } =
        req.query;

      validateKeyword(
        search
      );

      const suggestions =
        await getSearchSuggestions(
          search
        );

      return res.status(200).json({
        success: true,
        message:
          "Search suggestions fetched successfully.",

        data: suggestions,
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