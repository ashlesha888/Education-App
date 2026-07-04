import User from "../models/User.js";
import CourseProgress from "../models/CourseProgress.js";
//next step with code please
export const fetchPurchasedCourses = async (
  studentId
) => {
  const courseProgress =
    await CourseProgress.find({
      user: studentId,
    })
      .populate({
        path: "courseId",
        select:
          "courseName courseDescription thumbnail price averageRating totalRatings instructor courseContent",
        populate: [
          {
            path: "instructor",
            select:
              "firstName lastName profileImage",
          },
          {
            path: "courseContent",
            select:
              "sectionName subSections",
            populate: {
              path: "subSections",
              select:
                "title timeDuration description",
            },
          },
        ],
      })
      .populate({
        path: "completedVideos",
        select: "title timeDuration",
      })
      .populate({
        path: "lastWatchedVideo",
        select:
          "title timeDuration",
      })
      .sort({
        updatedAt: -1,
      })
      .lean();

  return {
    courseProgress,
    totalCourses:
      courseProgress.length,
  };
};


export const validateStudent = async (studentId) => {
    const student =
      await User.findOne({
        _id: studentId,
        accountType: "Student",
      }).lean();

    if (!student) {
      const error = new Error(
        "Student not found."
      );

      error.statusCode = 404;

      throw error;
    }

    return student;
};

export const calculateStudentStatistics = (
  courseProgress
) => {
  const totalPurchasedCourses =
    courseProgress.length;

  const completedCourses =
    courseProgress.filter(
      (course) => course.isCompleted
    ).length;

  const inProgressCourses =
    totalPurchasedCourses -
    completedCourses;

  let totalVideos = 0;
  let completedVideos = 0;

  courseProgress.forEach(
    (progress) => {
      progress.courseId?.courseContent?.forEach(
        (section) => {
          totalVideos +=
            section.subSections?.length || 0;
        }
      );

      completedVideos +=
        progress.completedVideos
          ?.length || 0;
    }
  );

  const overallCompletion =
    totalVideos > 0
      ? Number(
          (
            (completedVideos /
              totalVideos) *
            100
          ).toFixed(2)
        )
      : 0;

  let totalLearningSeconds = 0;

  courseProgress.forEach(
    (progress) => {
      progress.completedVideos?.forEach(
        (video) => {
          totalLearningSeconds +=
            convertDurationToSeconds(
              video.timeDuration
            );
        }
      );
    }
  );

  return {
    totalPurchasedCourses,

    completedCourses,

    inProgressCourses,

    totalLearningHours:
      Number(
        (
          totalLearningSeconds /
          3600
        ).toFixed(2)
      ),

    overallCompletion,
  };
};

export const getContinueWatchingData = (
  courseProgress
) => {
  return courseProgress
    .filter(
      (progress) =>
        !progress.isCompleted &&
        progress.lastWatchedVideo &&
        progress.courseId
    )
    .map((progress) => {
      const totalVideos =
  getTotalVideos(
    progress.courseId
  );

      const completedVideos =
        progress.completedVideos
          ?.length || 0;

const progressPercentage =
  calculateProgressPercentage(
    completedVideos,
    totalVideos
  );

    return {
    ...formatCourseCard(
        progress.courseId
    ),

    completedVideos,

    totalVideos,

    completionPercentage:
        100,

    completedAt:
        progress.updatedAt,
};
    })
    .sort(
      (a, b) =>
        new Date(
          b.updatedAt
        ) -
        new Date(a.updatedAt)
    );
};

export const getRecentlyCompletedData = (
  courseProgress
) => {
  return courseProgress
    .filter(
      (progress) =>
        progress.isCompleted &&
        progress.courseId
    )
    .map((progress) => {
      const totalVideos =
        getTotalVideos(
          progress.courseId
        );

      const completedVideos =
        progress.completedVideos
          ?.length || 0;

return {
    ...formatCourseCard(
        progress.courseId
    ),

    completedVideos,

    totalVideos,

    completionPercentage:
        100,

    completedAt:
        progress.updatedAt,
};
    })
    .sort(
      (a, b) =>
        new Date(
          b.completedAt
        ) -
        new Date(a.completedAt)
    );
};

export const getLearningProgressData = (
  courseProgress
) => {
  return courseProgress
    .filter(
      (progress) =>
        progress.courseId
    )
    .map((progress) => {
      const totalVideos =
        getTotalVideos(
          progress.courseId
        );

      const completedVideos =
        progress.completedVideos
          ?.length || 0;

  const progressPercentage =
  calculateProgressPercentage(
    completedVideos,
    totalVideos
  );

      return {
        ...formatCourseCard(
          progress.courseId
        ),

        totalVideos,

        completedVideos,

        remainingVideos:
          totalVideos -
          completedVideos,

        progressPercentage,

        isCompleted:
          progress.isCompleted,

        lastWatchedVideo:
          progress.lastWatchedVideo
            ? {
                _id:
                  progress
                    .lastWatchedVideo
                    ._id,

                title:
                  progress
                    .lastWatchedVideo
                    .title,

                timeDuration:
                  progress
                    .lastWatchedVideo
                    .timeDuration,
              }
            : null,

        lastActivity:
          progress.updatedAt,
      };
    })
    .sort(
      (a, b) =>
        b.progressPercentage -
        a.progressPercentage
    );
};

export const getTimeSpentLearningData = (
  courseProgress
) => {
  let totalSeconds = 0;

  const courseWiseTime = courseProgress
    .filter(
      (progress) =>
        progress.courseId
    )
    .map((progress) => {
      let courseSeconds = 0;

      progress.completedVideos?.forEach(
        (video) => {
          courseSeconds +=
            parseDurationToSeconds(
              video.timeDuration
            );
        }
      );

      totalSeconds +=
        courseSeconds;

      return {
        ...formatCourseCard(
          progress.courseId
        ),

        totalLearningSeconds:
          courseSeconds,

        totalLearningMinutes:
          Math.floor(
            courseSeconds / 60
          ),

        totalLearningHours:
          Number(
            (
              courseSeconds /
              3600
            ).toFixed(2)
          ),
      };
    });

  return {
    totalLearningSeconds:
      totalSeconds,

    totalLearningMinutes:
      Math.floor(
        totalSeconds / 60
      ),

    totalLearningHours:
      Number(
        (
          totalSeconds /
          3600
        ).toFixed(2)
      ),

    courseWiseTime,
  };
};

const parseDurationToSeconds = (
  duration
) => {
  if (
    !duration ||
    typeof duration !== "string"
  ) {
    return 0;
  }

  const parts =
    duration.split(":").map(Number);

  if (
    parts.some(Number.isNaN)
  ) {
    return 0;
  }

  if (parts.length === 3) {
    return (
      parts[0] * 3600 +
      parts[1] * 60 +
      parts[2]
    );
  }

  if (parts.length === 2) {
    return (
      parts[0] * 60 +
      parts[1]
    );
  }

  return parts[0];
};

const getTotalVideos = (course) => {
  let totalVideos = 0;

  course.courseContent?.forEach(
    (section) => {
      totalVideos +=
        section.subSections?.length || 0;
    }
  );

  return totalVideos;
};

const formatCourseCard = (
  course
) => {
  return {
    courseId: course._id,
    courseName:
      course.courseName,
    thumbnail:
      course.thumbnail,
    instructor:
      course.instructor,
    averageRating:
      course.averageRating,
    totalRatings:
      course.totalRatings,
  };
};

const calculateProgressPercentage = (
  completedVideos,
  totalVideos
) => {
  if (totalVideos === 0) {
    return 0;
  }

  return Number(
    (
      (completedVideos /
        totalVideos) *
      100
    ).toFixed(2)
  );
};
