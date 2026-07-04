javascript
import {
  getStudentDashboardData,
} from "../utils/studentDashboardHelper.js";

export const getStudentDashboard =
  async (req, res) => {
    try {
      const studentId =
        req.user.id;

      const dashboard =
        await getStudentDashboardData(
          studentId,
          {
            statistics: true,
            purchasedCourses: true,
            continueWatching: true,
            recentlyCompleted: true,
            learningProgress: true,
            timeSpent: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Student dashboard fetched successfully",
        data: dashboard,
      });

    } catch (error) {
      console.error(error);

      return res.status(
        error.statusCode || 500
      ).json({
        success: false,
        message:
          error.message ||
          "Internal Server Error",
      });
    }
  };

javascript
export const getDashboardSummary =
  async (req, res) => {
    try {
      const studentId =
        req.user.id;

      const {
        statistics,
      } =
        await getStudentDashboardData(
          studentId,
          {
            statistics: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Dashboard summary fetched successfully",
        data: statistics,
      });

    } catch (error) {
      console.error(error);

      return res.status(
        error.statusCode || 500
      ).json({
        success: false,
        message:
          error.message ||
          "Internal Server Error",
      });
    }
  };

