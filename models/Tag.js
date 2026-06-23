import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
    tagName: { 
        type: String,
        required: true,
        trim: true,
    },
    tagDescription: { 
        type: String,
        required: true,
        trim: true,
    },
    courses: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }
    ]
}, { timestamps: true });

const Tag = mongoose.model('Tag', TagSchema);
export default Tag; 
