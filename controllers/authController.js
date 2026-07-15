import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import {
  sendWelcomeEmail,
} from "../utils/emailHelper.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import OTP from "../models/OTP.js";
import {
  sendPasswordResetEmail,
} from "../utils/emailHelper.js";
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email }).select("_id").lean();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User is already registered",
      });
    }

    // 2. Generate a unique OTP
    let generatedOtp = "";
    let otpExists = true;

    while (otpExists) {
      generatedOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      // Ensure this specific OTP doesn't already exist in the DB
      const checkOtp = await OTP.findOne({ otp: generatedOtp }).lean();
      if (!checkOtp) {
        otpExists = false;
      }
    }

    // 3. Save the unique OTP to the database
    // (This will trigger your pre-save hook in the OTP Schema to send the email!)
    const savedOtp = await OTP.create({
      email,
      otp: generatedOtp,
    });

    console.log("SEND OTP EMAIL:", email);
    console.log("SEND OTP:", generatedOtp);

    // 4. Return success response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // You can temporarily include otp in response for easier Postman testing:
      // otp: generatedOtp 
    });
  } catch (error) {
    console.error("OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !accountType ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

console.log("EMAIL RECEIVED:", email);
console.log("FOUND OTP:", recentOtp);
console.log("Entered OTP:", otp);
console.log("Stored OTP:", recentOtp?.otp);

if (!recentOtp || recentOtp.otp !== otp) {
  return res.status(400).json({
    success: false,
    message: "Invalid or expired OTP",
  });
}
await OTP.deleteOne({ _id: recentOtp._id });
    const hashedPassword = await bcrypt.hash(password, 10);

    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalData: profile._id,
      profileImage: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        `${firstName} ${lastName}`
      )}`,
    });
try {
  await sendWelcomeEmail(user);
} catch (error) {
  console.error("Welcome email failed:", error.message);
}
    return res.status(201).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "User registration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email })
      .select("+password")
      .populate("additionalData");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.accountType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    return res
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Login failed, please try again",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const options = {

      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    return res
      .clearCookie("token", options)
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });


  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Logout failed, please try again",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email",
      });
    }
    let generatedOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: generatedOtp });

    while (result) {
      generatedOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,

      });

      result = await OTP.findOne({ otp: generatedOtp });
    }
    await OTP.create({
      email,
      otp: generatedOtp,
    });
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;
    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.",
      });
    }
    const recentOtp = await OTP.findOne({ email }).sort({
  createdAt: -1,
});

console.log(recentOtp);

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired or does not exist",
      });
    }

    if (otp.trim() !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
const updatedUser =
await User.findOne({
  email,
});
try {

  await sendPasswordResetEmail(
    updatedUser
  );

} catch (error) {

  console.error(
    "Password reset email failed:",
    error.message
  );

}
    await OTP.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};



export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.",
      });
    }

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to change password",
    });
  }
};


