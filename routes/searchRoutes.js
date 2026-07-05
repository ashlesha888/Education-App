import express from "express";

import {
  searchCoursesController,
  searchInstructorsController,
  searchCategoriesController,
  globalSearchController,
  getSearchSuggestionsController,
} from "../controllers/searchController.js";

const router =
  express.Router();

router.get(
  "/courses",
  searchCoursesController
);

router.get(
  "/global",
  globalSearchController
);

router.get(
  "/suggestions",
  getSearchSuggestionsController
);

router.get(
  "/instructors",
  searchInstructorsController
);

router.get(
  "/categories",
  searchCategoriesController
);


export default router;