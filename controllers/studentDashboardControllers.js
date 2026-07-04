import * as dashboardHelper from '../utils/studentDashboardHelper.js';

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    // Concurrently fetch all six pieces of dashboard data
    const [
      summary,
      purchasedCourses,
      continueWatching,
      recentlyCompleted,
      learningProgress,
      timeSpent
    ] = await Promise.all([
      dashboardHelper.getDashboardSummary(studentId),
      dashboardHelper.getPurchasedCourses(studentId),
      dashboardHelper.getContinueWatching(studentId),
      dashboardHelper.getRecentlyCompleted(studentId),
      dashboardHelper.getLearningProgress(studentId),
      dashboardHelper.getTimeSpentLearning(studentId)
    ]);

    return res.status(200).json({
      success: true,
      message: "Student dashboard data fetched successfully.",
      data: {
        summary,
        purchasedCourses,
        continueWatching,
        recentlyCompleted,
        learningProgress,
        timeSpent
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student dashboard data.',
      error: error.message
    });
  }
};
