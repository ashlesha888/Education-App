import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    keyword: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


searchHistorySchema.index({ user: 1, keyword: 1 }, { unique: true });
searchHistorySchema.index({ user: 1, updatedAt: -1 });
searchHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model("SearchHistory", searchHistorySchema);