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
      // Removed redundant inline index: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      // Removed redundant inline index: true
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
      sparse: true, // Allows null/missing values for alternative payment models or initialization failures
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

// Single-field indexes for the Payment Schema
paymentSchema.index({ student: 1 });
paymentSchema.index({ course: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paymentId: 1 });
// Compound index for filtering successful/failed payments per student
paymentSchema.index({ student: 1, status: 1 });


const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;