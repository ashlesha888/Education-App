import {
  createPayment,
} from "../utils/paymentHelper.js";
import {
  verifyPayment,
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