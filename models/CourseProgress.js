import mongoose from "mongoose";

const CourseProgressSchema = new mongoose.Schema({
    courseId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true, 
    },
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subsection",
        }
    ]
}, { timestamps: true }); 

const CourseProgress = mongoose.model('CourseProgress', CourseProgressSchema);
export default CourseProgress;
