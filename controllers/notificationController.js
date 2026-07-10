import {
  getNotifications,
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