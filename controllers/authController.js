import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

import User from "../models/User.js";
import Profile from "../models/Profile.js";
import OTP from "../models/OTP.js";

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User is already registered",
      });
    }

    let generatedOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let otpExists = await OTP.findOne({ otp: generatedOtp });

    while (otpExists) {
      generatedOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      otpExists = await OTP.findOne({ otp: generatedOtp });
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

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length === 0 || recentOtp[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

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

export const logout = async (req, res)=>{
  try {const options = {

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