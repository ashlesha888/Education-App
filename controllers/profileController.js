import Profile from "../models/profile.js";
import User from "../models/user.js";

// ==========================================
// 1. UPDATE PROFILE DATA
// ==========================================
export const updateProfile = async (req, res) => {
    try {
        const { gender, dateOfBirth, about, contactNumber } = req.body;
        const userId = req.user.id; // Extracted safely from the auth middleware token

        // Find the user to get their linked Profile ID
        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalData;

        // Find the linked profile document and update its fields
        const profileDetails = await Profile.findById(profileId);

        if (gender) profileDetails.gender = gender;
        if (dateOfBirth) profileDetails.dateOfBirth = dateOfBirth;
        if (about) profileDetails.about = about;
        if (contactNumber) profileDetails.contactNumber = contactNumber;

        // Save the updated profile to the database
        await profileDetails.save();

        // Fetch the fully updated user data to send back to the frontend
        const updatedUserDetails = await User.findById(userId).populate("additionalData").exec();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update profile",
            error: error.message,
        });
    }
};

// ==========================================
// 2. DELETE ACCOUNT (CRON / Cascade Delete)
// ==========================================
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete the associated Profile document first to prevent orphan data
        await Profile.findByIdAndDelete(userDetails.additionalData);

        // TODO: (Optional) Unenroll the student from all courses if needed before deletion

        // Delete the official User record
        await User.findByIdAndDelete(userId);

        // Clear the browser auth token cookie
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Account and associated profile deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete account",
            error: error.message,
        });
    }
};

// ==========================================
// 3. GET USER DETAILS
// ==========================================
export const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const userDetails = await User.findById(userId).populate("additionalData").exec();
        
        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user details",
            error: error.message,
        });
    }
};
