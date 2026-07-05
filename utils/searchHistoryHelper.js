import SearchHistory
  from "../models/SearchHistory.js";

  
export const saveRecentSearch =
  async (
    userId,
    keyword
  ) => {
    if (
      !keyword ||
      !keyword.trim()
    ) {
      return;
    }
    await SearchHistory.findOneAndUpdate(
      {
        user: userId,
        keyword:
          keyword
            .trim()
            .toLowerCase(),
      },
      {
        $set: {
          updatedAt:
            new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert:
          true,
      }
    );

  };

export const getRecentSearches =
  async (
    userId,
    limit =
      SEARCH_PAGINATION.RECENT_SEARCH_LIMIT
  ) => {
    return await SearchHistory.find({
      user: userId,
    })
      .sort({
        updatedAt: -1,
      })
      .limit(limit)
      .lean();
  };

export const clearRecentSearches =
  async (
    userId
  ) => {
    return await SearchHistory.deleteMany({
      user: userId,
    });
  };

