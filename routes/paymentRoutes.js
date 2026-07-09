import express from "express";

import { auth } from "../middlewares/authMiddleware.js";

import {
  createPaymentController,
  verifyPaymentController,
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


export default router;