import Course from "../models/course.js";
import {
    findExistingCourse,
} from "./tagHelper.js"; 
import {
    uploadToCloudinary,
} from "./cloudinaryHelper.js";
import {
    formatUploadedFile,
} from "./fileFormatter.js";
import {
  CLOUDINARY_FOLDERS,
  RESOURCE_TYPES,
} from "../config/constants.js";

export const calculateCourseDuration =
    (
        courseContent
    ) => {
        let totalSeconds = 0;

        courseContent.forEach(
            (section) => {
                section.subSections?.forEach(
                    (video) => {
                        totalSeconds +=
                            parseDurationToSeconds(
                                video.timeDuration
                            );
                    }
                );
            }
        );

        return totalSeconds;
};

export const uploadCourseThumbnail = async (
    courseId,
    file
) => {

    const course =
        await findExistingCourse(
            courseId
        );

    const uploadResult =
        await uploadToCloudinary(
            file,
            CLOUDINARY_FOLDERS.COURSE_THUMBNAILS,
            RESOURCE_TYPES.IMAGE
        );

    const formattedFile =
        formatUploadedFile(
            uploadResult
        );

course.thumbnail = {
  url:
    formattedFile.url,

  publicId:
    formattedFile.publicId,

  format:
    formattedFile.format,

  size:
    formattedFile.size,
};
    if (
  course.thumbnail?.publicId
) {
  await deleteFromCloudinary(
    course.thumbnail.publicId,
    RESOURCE_TYPES.IMAGE
  );
}

    await course.save();

    return {
        course,
        thumbnail:
            formattedFile,
    };
};