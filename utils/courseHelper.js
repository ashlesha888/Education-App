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
import {
  deleteFromCloudinary,
} from "./cloudinaryHelper.js";

import {
  RESOURCE_TYPES,
} from "../config/constants.js";
import {
  getFileMetadata,
} from "./fileFormatter.js";

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

/**
 * Get Course Thumbnail Metadata
 */
export const getCourseThumbnailMetadata =
  async (
    courseId
  ) => {

    const course =
      await findExistingCourse(
        courseId
      );

    return getFileMetadata(
      course.thumbnail
    );

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
await replaceUploadedFile(

course.thumbnail?.publicId,

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

/**
 * Delete Course Thumbnail
 */
export const deleteCourseThumbnail =
  async (
    courseId
  ) => {

    const course =
      await findExistingCourse(
        courseId
      );

    if (
      !course.thumbnail
    ) {

      const error =
        new Error(
          "Course thumbnail not found."
        );

      error.statusCode = 404;

      throw error;
    }
if(
course.instructor.toString()
!==req.user.id
){

throw new Error(
"You are not authorized."
);

}
    await deleteFromCloudinary(
      course.thumbnail.publicId,
      RESOURCE_TYPES.IMAGE
    );

    course.thumbnail = null;

    await course.save();

    return course;
};

export const clearUploadedFile =
(
  model,
  field
)=>{

model[field]=null;

return model.save();

};