import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Restricts ratings to standard 1-5 stars
    },
    review: {
        type: String,
        required: true,
        trim: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true, // Speeds up lookups when fetching reviews for a specific course
    }
}, { timestamps: true });

const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema);
export default RatingAndReview;
