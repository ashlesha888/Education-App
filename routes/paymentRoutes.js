import express from "express";

import { auth } from "../middlewares/auth.js";

import {
  createPaymentController,
  verifyPaymentController,
  getPaymentHistoryController,
  getPaymentDetailsController,
  getRevenueReportController,
} from "../controllers/paymentController.js";
import {
  paymentWebhookController,
} from "../controllers/paymentWebhookController.js";
import {

  getMonthlyRevenueController,

  getTopSellingCoursesController,

} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * Payment Routes
 */

router.post(
  "/create-order",
  auth,
  createPaymentController
);


router.post(
  "/verify-payment",
  auth,
  verifyPaymentController
);

router.get(
  "/history",
  auth,
  getPaymentHistoryController
);

router.get(
  "/:paymentId",
  auth,
  getPaymentDetailsController
);

router.post(
  "/webhook",
  paymentWebhookController
);

router.get(
  "/analytics/revenue",
  auth,
  getRevenueReportController
);

router.get(
  "/analytics/monthly-revenue",
  auth,
  getMonthlyRevenueController
);

router.get(
  "/analytics/top-courses",
  auth,
  getTopSellingCoursesController
);

export default router;