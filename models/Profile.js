import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ["Male", "Female", "Non-Binary", "Other", "Prefer not to say"], 
    },
    dateOfBirth: {
        type: String, 
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: String, 
        trim: true,   
    }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
