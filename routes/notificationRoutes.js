import express from "express";
import { auth } from "../middlewares/authMiddleware.js";
import {
  getNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
} from "../controllers/notificationController.js";
import {
  isAdmin,
} from "../middlewares/authMiddleware.js";

import {
  createAnnouncementController,
  broadcastNotificationController,
} from "../controllers/notificationController.js";
const router = express.Router();

router.get("/", auth, getNotificationsController);
router.patch("/:notificationId/read", auth, markNotificationAsReadController);
router.patch("/read-all", auth, markAllNotificationsAsReadController);
router.delete("/:notificationId", auth, deleteNotificationController);
router.post(
  "/announcement",
  auth,
  isAdmin,
  createAnnouncementController
);

router.post(
  "/broadcast",
  auth,
  isAdmin,
  broadcastNotificationController
);
export default router;