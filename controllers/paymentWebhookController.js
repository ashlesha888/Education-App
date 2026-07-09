import crypto from "crypto";

import Payment from "../models/paymentModel.js";

import {
  PAYMENT_STATUS,
} from "../config/constants.js";

import {
  enrollStudent,
} from "../utils/enrollmentHelper.js";

import {
  generateInvoiceNumber,
} from "../utils/paymentHelper.js";
export const paymentWebhookController =
async (
  req,
  res,
  next
) => {

  try {

    const signature =
      req.headers[
        "x-razorpay-signature"
      ];

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_WEBHOOK_SECRET
        )
        .update(
          JSON.stringify(req.body)
        )
        .digest("hex");

    if (
      signature !==
      expectedSignature
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "Invalid webhook signature.",

        });

    }

    const event =
      req.body.event;

    if (
      event ===
      "payment.captured"
    ) {

      const paymentEntity =
        req.body.payload
          .payment
          .entity;

      const payment =
        await Payment.findOne({

          razorpayOrderId:
            paymentEntity.order_id,

        });

      if (
        payment &&
        payment.status !==
          PAYMENT_STATUS.SUCCESS
      ) {

        payment.status =
          PAYMENT_STATUS.SUCCESS;

        payment.razorpayPaymentId =
          paymentEntity.id;

        payment.paymentMethod =
          paymentEntity.method;

        payment.invoiceNumber =
          generateInvoiceNumber();

        await payment.save();

        await enrollStudent({

          studentId:
            payment.student,

          courseId:
            payment.course,

        });

      }

    }

    return res
      .status(200)
      .json({

        success: true,

      });

  } catch (error) {

    next(error);

  }

};
