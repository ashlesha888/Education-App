import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import User from '../models/user.js';
import Profile from '../models/profile.js';
import OTP from '../models/otp.js';

// ==========================================
// 1. GENERATE AND SEND OTP
// ==========================================
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User is already registered",
            });
        }

        // Generate a unique 6-digit numeric OTP
        let generatedOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Ensure OTP uniqueness in the temporary database
        let result = await OTP.findOne({ otp: generatedOtp });
        while (result) {
            generatedOtp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: generatedOtp });
        }

        // Save OTP to DB (This automatically triggers the pre-save email hook!)
        await OTP.create({ email, otp: generatedOtp });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. USER SIGNUP (WITH OTP VERIFICATION)
// ==========================================
export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, accountType, otp } = req.body;

        // Validate required inputs
        if (!firstName || !lastName || !email || !password || !accountType || !otp) {
            return res.status(403).send({
                success: false,
                message: "All fields are required",
            });
        }

        // Find the most recent OTP sent to this email address
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        
        if (recentOtp.length === 0 || otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is invalid or has expired",
            });
        }

        // Hash the password for database security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create an empty Profile document first for additionalData
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // Create the official User record
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalData: profileDetails._index || profileDetails._id,
            images: `https://dicebear.com{firstName} ${lastName}`,
        });

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. USER LOGIN
// ==========================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        // Find user and populate their profile data
        const user = await User.findOne({ email }).populate("additionalData");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please sign up first",
            });
        }

        // Compare password hashes
        if (await bcrypt.compare(password, user.password)) {
            // Generate JSON Web Token (JWT)
            const token = jwt.sign(
                { email: user.email, id: user._id, role: user.accountType },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            // Clean up the object before sending back to client
            user.password = undefined;

            // Set secure cookie configuration options
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
                httpOnly: true, // Safeguards against XSS attacks
            };

            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Login failure, please try again" });
    }
};
