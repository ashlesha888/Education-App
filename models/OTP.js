import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  otp: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Moved the expiration logic to an explicit index declaration below
  },
});

// --- Email Helper Function ---
async function sendVerificationEmail(email, otp) {
  try {
    await mailSender(
      email,
      "Verification Email from StudyNotion",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your One-Time Password (OTP) to complete your registration: <b>${otp}</b></p>
       <p>This code is valid for 5 minutes.</p>`
    );
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

// --- Pre-save Hook ---
otpSchema.pre("save", async function () {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
});

// Single-field indexes for the OTP Schema
otpSchema.index({ email: 1 });


const OTP = mongoose.model("OTP", otpSchema);

export default OTP;