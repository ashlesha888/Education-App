import { validateStudent } from "../utils/studentDashboardHelper.js";

export const isStudent =
  async (req, res, next) => {
    try {
      await validateStudent(
        req.user.id
      );

      next();

    } catch (error) {
      return res.status(
        error.statusCode || 500
      ).json({
        success: false,
        message:
          error.message,
      });
    }
  };