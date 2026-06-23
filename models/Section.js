import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true, 
        trim: true,
    },
    subSection: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true, 
            ref: "Subsection", 
        }
    ]
}, { timestamps: true });

const Section = mongoose.model('Section', SectionSchema);
export default Section;
