import {
  createPayment,
} from "../utils/paymentHelper.js";
import {
  verifyPayment,
} from "../utils/paymentHelper.js";
import {
  getRevenueReport,
} from "../utils/paymentHelper.js";
import {
  getPaymentHistory,
  getPaymentDetails,
} from "../utils/paymentHelper.js";

import {

  getMonthlyRevenue,

  getTopSellingCourses,

} from "../utils/paymentHelper.js";
/**
 * Create Payment Order
 */
export const createPaymentController =
async (
  req,
  res,
  next
) => {

  try {

    const {
      courseId,
    } = req.body;

    const studentId =
      req.user.id;

    const {
      payment,
      razorpayOrder,
    } =
      await createPayment({

        studentId,

        courseId,

      });

    return res.status(201).json({

      success: true,

      message:
        "Payment order created successfully.",

      data: {

        paymentId:
          payment._id,

        orderId:
          razorpayOrder.id,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,

        receipt:
          razorpayOrder.receipt,

      },

    });

  } catch (error) {

    next(error);

  }

};

/**
 * Verify Payment
 */
export const verifyPaymentController =
async (
  req,
  res,
  next
) => {

  try {

    const {

      razorpayOrderId,

      razorpayPaymentId,

      razorpaySignature,

    } = req.body;

    const payment =
      await verifyPayment({

        razorpayOrderId,

        razorpayPaymentId,

        razorpaySignature,

      });

    return res.status(200).json({

      success: true,

      message:
        "Payment verified successfully.",

      data: payment,

    });

  } catch (error) {

    next(error);

  }

};
/**
 * Get Payment History
 */
export const getPaymentHistoryController =
async (
  req,
  res,
  next
) => {

  try {

    const payments =
      await getPaymentHistory(
        req.user.id
      );

    return res.status(200).json({

      success: true,

      count: payments.length,

      data: payments,

    });

  } catch (error) {

    next(error);

  }

};
/**
 * Get Payment Details
 */
export const getPaymentDetailsController =
async (
  req,
  res,
  next
) => {

  try {

    const payment =
      await getPaymentDetails(

        req.params.paymentId,

        req.user.id

      );

    return res.status(200).json({

      success: true,

      data: payment,

    });

  } catch (error) {

    next(error);

  }

};
export const getRevenueReportController =
async (
  req,
  res,
  next
) => {

  try {

    const report =
      await getRevenueReport();

    return res
      .status(200)
      .json({

        success: true,

        data: report,

      });

  } catch (error) {

    next(error);

  }

};

export const getMonthlyRevenueController =
async (
  req,
  res,
  next
) => {

  try {

    const revenue =
      await getMonthlyRevenue();

    return res
      .status(200)
      .json({

        success: true,

        data: revenue,

      });

  } catch (error) {

    next(error);

  }

};

export const getTopSellingCoursesController =
async (
  req,
  res,
  next
) => {

  try {

    const courses =
      await getTopSellingCourses();

    return res
      .status(200)
      .json({

        success: true,

        data: courses,

      });

  } catch (error) {

    next(error);

  }

};

