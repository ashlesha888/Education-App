import express from "express";

import { 
  createTagController,
  getAllTagsController,
  getTagByIdController,
  updateTagController,
  deleteTagController,
  getCoursesByTagController,
  addTagToCourseController,
  removeTagFromCourseController,
  replaceCourseTagsController,
  getPopularTagsController,
  getTagStatisticsController,
  searchTagsController,
} from "../controllers/tagController.js";

import { auth, isAdmin} from "../middlewares/auth.js";

const router = express.Router();

router.post( "/create-tag", auth, isAdmin, createTagController);

router.get( "/get-all-tag", getAllTagsController);

router.get( "/get-tag/:tagId", getTagByIdController);

router.put( "/update-tag/:tagId", auth, isAdmin, updateTagController);

router.delete("/delete-tag/:tagId", auth, isAdmin, deleteTagController);

router.get("/get-courses/:tagId", getCoursesByTagController);

router.patch(
  "/add-tag-to-course",
  auth,
  isAdmin,
  addTagToCourseController
);

router.patch(
  "/remove-tag-from-course",
  auth,
  isAdmin,
  removeTagFromCourseController
);

router.patch(
  "/replace-course-tags",
  auth,
  isAdmin,
  replaceCourseTagsController
);

router.get(
  "/popular-tags",
  getPopularTagsController
);

router.get(
  "/statistics",
  auth,
  isAdmin,
  getTagStatisticsController
);

export default router;