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
} from "../controllers/tagController.js";

import { protect, isAdmin} from "../middlewares/auth.js";

const router = express.Router();

router.post( "/create-tag", protect, isAdmin, createTagController);

router.get( "/get-all-tag", getAllTagsController);

router.get( "/get-tag/:tagId", getTagByIdController);

router.put( "/update-tag/:tagId", protect, isAdmin, updateTagController);

router.delete("/delete-tag/:tagId", protect, isAdmin, deleteTagController);

router.get("/get-courses/:tagId", getCoursesByTagController);

router.patch(
  "/add-tag-to-course",
  protect,
  isAdmin,
  addTagToCourseController
);

router.patch(
  "/remove-tag-from-course",
  protect,
  isAdmin,
  removeTagFromCourseController
);

router.patch(
  "/replace-course-tags",
  protect,
  isAdmin,
  replaceCourseTagsController
);

export default router;