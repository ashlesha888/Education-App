import User from "../models/userModel.js";
/**
 * Get All Users
 */
export const getAllUsers = async () => {

  return await User.find()

    .populate(
      "profile"
    )

    .select("-password")

    .sort({
      createdAt: -1,
    });

};
/**
 * Get User By ID
 */
export const getUserById = async (
  userId
) => {

  const user =
    await User.findById(
      userId
    )

      .populate(
        "profile"
      )

      .select("-password");

  if (!user) {

    const error =
      new Error(
        "User not found."
      );

    error.statusCode = 404;

    throw error;

  }

  return user;

};
/**
 * Update User
 */
export const updateUser = async (
  userId,
  updates
) => {

  const user =
    await User.findById(
      userId
    );

  if (!user) {

    const error =
      new Error(
        "User not found."
      );

    error.statusCode = 404;

    throw error;

  }

  Object.assign(
    user,
    updates
  );

  await user.save();

  return user;

};
