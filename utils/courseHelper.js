import Course from "../models/course.js";
import { formatUploadedFile, getFileMetadata } from "./fileFormatter.js";
import { CLOUDINARY_FOLDERS, RESOURCE_TYPES } from "../config/constants.js";
import { replaceUploadedFile, deleteFromCloudinary } from "./cloudinaryHelper.js";

export const calculateCourseDuration = (courseContent) => {
  let totalSeconds = 0;

  courseContent.forEach((section) => {
    section.subSections?.forEach((video) => {
      totalSeconds += parseDurationToSeconds(video.timeDuration);
    });
  });

  return totalSeconds;
};

export const findExistingCourse = async (courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    const error = new Error("Course not found.");
    error.statusCode = 404;
    throw error;
  }

  return course;
};

export const getCourseThumbnailMetadata = async (courseId) => {
  const course = await findExistingCourse(courseId);
  return getFileMetadata(course.thumbnail);
};

export const clearUploadedFile = (model, field) => {
  model[field] = null;
  return model.save();
};

export const uploadCourseThumbnail = async (courseId, file) => {
  const course = await findExistingCourse(courseId);

  const uploadResult = await replaceUploadedFile({
    oldPublicId: course.thumbnail?.publicId,
    file,
    folder: CLOUDINARY_FOLDERS.COURSE_THUMBNAILS,
    resourceType: RESOURCE_TYPES.IMAGE,
  });

  const formattedFile = formatUploadedFile(uploadResult);

  course.thumbnail = formattedFile;

  await course.save();

  return {
    course,
    thumbnail: formattedFile,
  };
};

export const deleteCourseThumbnail = async (courseId, userId) => {
  const course = await findExistingCourse(courseId);

  if (!course.thumbnail) {
    const error = new Error("Course thumbnail not found.");
    error.statusCode = 404;
    throw error;
  }

  if (course.instructor.toString() !== userId) {
    const error = new Error("You are not authorized.");
    error.statusCode = 403;
    throw error;
  }

  return await deleteUploadedFile({
    model: course,
    field: "thumbnail",
    resourceType: RESOURCE_TYPES.IMAGE,
  });
};

