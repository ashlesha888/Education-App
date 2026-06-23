import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js"; 

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, 
    }
});


async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email, 
            "Verification Email from StudyNotion", 
            `<h1>Please confirm your OTP</h1>
             <p>Here is your One-Time Password (OTP) to complete your registration: <b>${otp}</b></p>
             <p>This code is valid for 5 minutes.</p>`
        );
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.error("Error occurred while sending verification mail: ", error);
        throw error;
    }
}


OTPSchema.pre("save", async function (next) {
    
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next(); 
});

const OTP = mongoose.model('OTP', OTPSchema);
export default OTP;
