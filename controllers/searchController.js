import { searchCourses, validateSearchQuery,globalSearch,
  validateKeyword,} from "../utils/searchHelper.js";

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