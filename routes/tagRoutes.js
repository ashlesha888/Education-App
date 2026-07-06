import express from "express";

import {
  createTagController,
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

export default router;