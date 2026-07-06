import express from "express";

import {
  createTagController,
  getAllTagsController,
} from "../controllers/tagController.js";

import { protect, isAdmin} from "../middlewares/auth.js";

const router =
  express.Router();

router.post(
  "/create-tag",
  protect,
  isAdmin,
  createTagController
);
router.get(
  "/get-all-tag",
  getAllTagsController
);
export default router;