import express from "express";

import { auth } from "../middlewares/authMiddleware.js";

import {
  getNotificationsController,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get(
  "/",
  auth,
  getNotificationsController
);

export default router;