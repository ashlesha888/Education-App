import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import {
  PAYMENT_CURRENCY,
} from "../config/constants.js";


/**
 * Create Razorpay Order
 */
export const createPaymentOrder = async ({
  amount,
  receipt,
  notes = {},
}) => {

  try {

    const order =
      await razorpay.orders.create({

        amount:
          amount * 100,

        currency:
          PAYMENT_CURRENCY,

        receipt,

        notes,

      });

    return order;

  } catch (error) {

    const paymentError =
      new Error(
        "Unable to create payment order."
      );

    paymentError.statusCode = 500;
    paymentError.cause = error;

    throw paymentError;

  }

};

/**
 * Verify Razorpay Payment Signature
 */
export const verifyPaymentSignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {

  const body =
    `${razorpayOrderId}|${razorpayPaymentId}`;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

  return (
    expectedSignature ===
    razorpaySignature
  );

};

/**
 * Fetch Payment Details
 */
export const fetchPaymentDetails = async (
  paymentId
) => {

  try {

    const payment =
      await razorpay.payments.fetch(
        paymentId
      );

    return payment;

  } catch (error) {

    const paymentError =
      new Error(
        "Unable to fetch payment details."
      );

    paymentError.statusCode = 500;
    paymentError.cause = error;

    throw paymentError;

  }

};

/**
 * Mark Payment as Cancelled
 */
export const cancelPayment = async (
  payment
) => {

  if (!payment) {

    const error = new Error(
      "Payment not found."
    );

    error.statusCode = 404;

    throw error;

  }

  if (
    payment.status === "Success"
  ) {

    const error = new Error(
      "Completed payments cannot be cancelled."
    );

    error.statusCode = 400;

    throw error;

  }

  payment.status = "Cancelled";

  await payment.save();

  return payment;

};