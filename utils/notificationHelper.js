import Notification from "../models/notification.js";
import User from "../models/user.js";


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
/**
 * Mark Notification as Read
 */
export const markNotificationAsRead =
async (
  notificationId,
  userId
) => {

  const notification =
    await findExistingNotification(
      notificationId
    );

  if (
    notification.recipient.toString()
    !== userId
  ) {

    const error =
      new Error(
        "Unauthorized access."
      );

    error.statusCode = 403;

    throw error;

  }

  if (
    !notification.isRead
  ) {

    notification.isRead = true;

    notification.readAt =
      new Date();

    await notification.save();

  }

  return notification;

};
/**
 * Mark All Notifications as Read
 */
export const markAllNotificationsAsRead =
async (
  userId
) => {

  const result =
    await Notification.updateMany(

      {

        recipient: userId,

        isRead: false,

      },

      {

        $set: {

          isRead: true,

          readAt: new Date(),

        },

      }

    );

  return result.modifiedCount;

};
/**
 * Delete Notification
 */
export const deleteNotification =
async (
  notificationId,
  userId
) => {

  const notification =
    await findExistingNotification(
      notificationId
    );

  if (
    notification.recipient.toString()
    !== userId
  ) {

    const error =
      new Error(
        "Unauthorized access."
      );

    error.statusCode = 403;

    throw error;

  }

  await Notification.findByIdAndDelete(
    notificationId
  );

  return true;

};
/**
 * Create Announcement
 */
export const createAnnouncement = async ({
  sender,
  title,
  message,
  recipients,
}) => {

  const notifications = recipients.map((recipient) => ({
    recipient,
    sender,
    title,
    message,
    type: "Announcement",
  }));

  return await Notification.insertMany(notifications);

};
/**
 * Broadcast Notification
 */
export const broadcastNotification = async ({
  sender,
  title,
  message,
}) => {

  const users = await User.find(
    {},
    "_id"
  ).lean();

  const notifications = users.map((user) => ({
    recipient: user._id,
    sender,
    title,
    message,
    type: "Announcement",
  }));

  return await Notification.insertMany(
    notifications
  );

};