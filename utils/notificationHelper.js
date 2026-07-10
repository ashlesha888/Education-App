import Notification from "../models/notificationModel.js";

/**
 * Create Notification
 */
export const createNotification =
async ({
  recipient,
  sender = null,
  title,
  message,
  type = "System",
  metadata = {},
}) => {

  return await Notification.create({

    recipient,
    sender,
    title,
    message,
    type,
    metadata,

  });

};
/**
 * Find Notification
 */
export const findExistingNotification =
async (
  notificationId
) => {

  const notification =
    await Notification.findById(
      notificationId
    );

  if (!notification) {

    const error =
      new Error(
        "Notification not found."
      );

    error.statusCode = 404;

    throw error;

  }

  return notification;

};
/**
 * Get User Notifications
 */
export const getNotifications =
async (
  userId
) => {

  return await Notification.find({

    recipient: userId,

  })

  .sort({

    createdAt: -1,

  });

};