import mongoose from "mongoose";
import {
  PAYMENT_STATUS,
  PAYMENT_CURRENCY,
} from "../config/constants.js";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: PAYMENT_CURRENCY,
    },

    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },

    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    paymentMethod: {
      type: String,
      default: null,
    },

    receipt: {
      type: String,
      unique: true,
    },

    invoiceNumber: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({
  student: 1,
  course: 1,
});

paymentSchema.index({
  status: 1,
});

paymentSchema.index({
  createdAt: -1,
});

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;