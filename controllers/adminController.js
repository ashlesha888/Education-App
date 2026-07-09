import {

  getAllUsers,

  getUserById,

  updateUser,

} from "../utils/adminHelper.js";
export const getAllUsersController =
async (
  req,
  res,
  next
) => {

  try {

    const users =
      await getAllUsers();

    return res.status(200).json({

      success: true,

      count: users.length,

      data: users,

    });

  } catch (error) {

    next(error);

  }

};
export const getUserByIdController =
async (
  req,
  res,
  next
) => {

  try {

    const user =
      await getUserById(
        req.params.userId
      );

    return res.status(200).json({

      success: true,

      data: user,

    });

  } catch (error) {

    next(error);

  }

};
export const updateUserController =
async (
  req,
  res,
  next
) => {

  try {

    const user =
      await updateUser(

        req.params.userId,

        req.body

      );

    return res.status(200).json({

      success: true,

      message:
        "User updated successfully.",

      data: user,

    });

  } catch (error) {

    next(error);

  }

};
