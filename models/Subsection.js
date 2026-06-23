import mongoose from "mongoose";

const SubsectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
        trim: true,
    },
    timeDuration: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true, 
    },
}, { timestamps: true }); 

const Subsection = mongoose.model('Subsection', SubsectionSchema);
export default Subsection;
