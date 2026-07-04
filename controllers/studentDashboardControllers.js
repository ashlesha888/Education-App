
import {
  getStudentDashboardData,
} from "../utils/studentDashboardHelper.js";

export const getStudentDashboard =async (req, res) => {
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


export const getDashboardSummary =async (req, res) => {
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


export const getPurchasedCourses =async (req, res) => {
    try {
      const studentId =
        req.user.id;

      const {
        purchasedCourses,
      } =
        await getStudentDashboardData(
          studentId,
          {
            purchasedCourses: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Purchased courses fetched successfully",

        count:
          purchasedCourses.length,

        data:
          purchasedCourses,
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


export const getContinueWatching =async (req, res) => {
    try {
      const studentId =
        req.user.id;

      const {
        continueWatching,
      } =
        await getStudentDashboardData(
          studentId,
          {
            continueWatching: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Continue watching courses fetched successfully",

        count:
          continueWatching.length,

        data:
          continueWatching,
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


export const getRecentlyCompletedCourses =async (req, res) => {
    try {
      const studentId =
        req.user.id;

      const {
        recentlyCompleted,
      } =
        await getStudentDashboardData(
          studentId,
          {
            recentlyCompleted: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Recently completed courses fetched successfully",

        count:
          recentlyCompleted.length,

        data:
          recentlyCompleted,
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


export const getLearningProgress =async (req, res) => {
    try {
      const studentId =
        req.user.id;

      const {
        learningProgress,
      } =
        await getStudentDashboardData(
          studentId,
          {
            learningProgress: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Learning progress fetched successfully",

        count:
          learningProgress.length,

        data:
          learningProgress,
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


export const getTimeSpentLearning =async (req, res) => {
    try {
      const studentId =
        req.user.id;

      const {
        timeSpent,
      } =
        await getStudentDashboardData(
          studentId,
          {
            timeSpent: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Learning time fetched successfully",

        data: timeSpent,
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

