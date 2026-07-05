import express from "express";

import {
  searchCoursesController,
  globalSearchController,
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

export default router;