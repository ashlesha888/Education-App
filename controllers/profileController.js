import Profile from "../models/Profile.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { gender, dateOfBirth, about, contactNumber } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await Profile.findById(user.additionalData);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    if (gender !== undefined) profile.gender = gender;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (about !== undefined) profile.about = about;
    if (contactNumber !== undefined) profile.contactNumber = contactNumber;

    await profile.save();

    const updatedUser = await User.findById(userId)
      .populate("additionalData")
      .lean();

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Profile.findByIdAndDelete(user.additionalData);

    await User.findByIdAndDelete(userId);

    return res
      .clearCookie("token")
      .status(200)
      .json({
        success: true,
        message: "Account deleted successfully",
      });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("additionalData")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User details fetched successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};