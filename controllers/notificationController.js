import {
  getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, createAnnouncement, broadcastNotification, 
} from "../utils/notificationHelper.js";

export const getNotificationsController =
async (
  req,
  res,
  next
) => {

  try {

    const notifications =
      await getNotifications(
        req.user.id
      );

    return res.status(200).json({

      success: true,

      count:
        notifications.length,

      data:
        notifications,

    });

  } catch (error) {

    next(error);

  }

};
export const markNotificationAsReadController =
async (
  req,
  res,
  next
) => {

  try {

    const notification =
      await markNotificationAsRead(

        req.params.notificationId,

        req.user.id

      );

    return res.status(200).json({

      success: true,

      message:
        "Notification marked as read.",

      data:
        notification,

    });

  } catch (error) {

    next(error);

  }

};
export const markAllNotificationsAsReadController =
async (
  req,
  res,
  next
) => {

  try {

    const updated =
      await markAllNotificationsAsRead(
        req.user.id
      );

    return res.status(200).json({

      success: true,

      updated,

    });

  } catch (error) {

    next(error);

  }

};
export const deleteNotificationController =
async (
  req,
  res,
  next
) => {

  try {

    await deleteNotification(

      req.params.notificationId,

      req.user.id

    );

    return res.status(200).json({

      success: true,

      message:
        "Notification deleted successfully.",

    });

  } catch (error) {

    next(error);

  }

};
export const createAnnouncementController =
async (
  req,
  res,
  next
) => {

  try {

    const {
      recipients,
      title,
      message,
    } = req.body;

    const notifications =
      await createAnnouncement({

        sender: req.user.id,

        recipients,

        title,

        message,

      });

    return res.status(201).json({

      success: true,

      message:
        "Announcement created successfully.",

      count:
        notifications.length,

      data:
        notifications,

    });

  } catch (error) {

    next(error);

  }

};
export const broadcastNotificationController =
async (
  req,
  res,
  next
) => {

  try {

    const {
      title,
      message,
    } = req.body;

    const notifications =
      await broadcastNotification({

        sender: req.user.id,

        title,

        message,

      });

    return res.status(201).json({

      success: true,

      message:
        "Broadcast sent successfully.",

      count:
        notifications.length,

    });

  } catch (error) {

    next(error);

  }

};