import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import {
  PAYMENT_CURRENCY,
} from "../config/constants.js";
import Payment from "../models/paymentModel.js";
import Course from "../models/courseModel.js";

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


export const createPayment = async ({
  studentId,
  courseId,
}) => {

  // Find Course
  const course =
    await Course.findById(
      courseId
    );

  if (!course) {

    const error =
      new Error(
        "Course not found."
      );

    error.statusCode = 404;

    throw error;

  }

  // Prevent duplicate purchase
  const existingPayment =
    await Payment.findOne({

      student: studentId,

      course: courseId,

      status: PAYMENT_STATUS.SUCCESS,

    });

  if (existingPayment) {

    const error =
      new Error(
        "Course already purchased."
      );

    error.statusCode = 400;

    throw error;

  }

  // Generate receipt
  const receipt =
    `RCPT_${Date.now()}`;

  // Create Razorpay Order
  const razorpayOrder =
    await createPaymentOrder({

      amount:
        course.price,

      receipt,

      notes: {

        studentId,

        courseId,

      },

    });

  // Save Payment
  const payment =
    await Payment.create({

      student:
        studentId,

      course:
        courseId,

      amount:
        course.price,

      receipt,

      razorpayOrderId:
        razorpayOrder.id,

      status:
        PAYMENT_STATUS.PENDING,

    });

  return {

    payment,

    razorpayOrder,

  };

};