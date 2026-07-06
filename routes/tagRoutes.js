import express from "express";

import { createTagController, getAllTagsController, getTagByIdController, updateTagController, } from "../controllers/tagController.js";

import { protect, isAdmin} from "../middlewares/auth.js";

const router = express.Router();

router.post( "/create-tag", protect, isAdmin, createTagController);

router.get( "/get-all-tag", getAllTagsController);

router.get( "/get-tag/:tagId", getTagByIdController);

router.put( "/update-tag/:tagId", protect, isAdmin, updateTagController);

export default router;