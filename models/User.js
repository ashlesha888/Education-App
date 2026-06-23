import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    accountType: {
        type: String,
        required: true,
        enum: ["Admin", "Student", "Instructor"],
    },
    additionalData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
    images: {
        type: String,
        required: true,
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress",
        }
    ],


}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;