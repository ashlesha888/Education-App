import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // Removed redundant inline index: true here
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ["Announcement", "Course", "Payment", "System", "Account"],
      default: "System",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Single-field indexes for the Notification Schema
notificationSchema.index({ user: 1 });
notificationSchema.index({ isRead: 1 });
// Compound index for counting or fetching unread user alerts
notificationSchema.index({ user: 1, isRead: 1 });


const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;