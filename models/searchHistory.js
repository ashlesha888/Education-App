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

// --- Indexing Strategy ---

// 1. Deduplication Unique Index (FIXED REDUNDANCY)
// Ensures that if a user searches for "javascript" multiple times, it doesn't create duplicate terms.
// Instead, your backend logic will find this record and just update its `updatedAt` / `createdAt` timestamp.
searchHistorySchema.index({ user: 1, keyword: 1 }, { unique: true });

// 2. Recent Searches Dropdown Menu (ESR Rule)
// Crucial for rendering the user's recent search suggestions dropdown, ordered by latest first.
// e.g., SearchHistory.find({ user: req.user.id }).sort({ updatedAt: -1 }).limit(5)
searchHistorySchema.index({ user: 1, updatedAt: -1 });

// 3. TTL Index (Database Housekeeping)
// Automatically purges old searches after 30 days (2,592,000 seconds) to prevent infinite data buildup.
searchHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model("SearchHistory", searchHistorySchema);