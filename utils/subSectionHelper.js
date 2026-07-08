import SubSection from "../models/subSectionModel.js";

import {
    uploadToCloudinary,
    deleteFromCloudinary,
} from "./cloudinaryHelper.js";

import {
    formatUploadedFile,
} from "./fileFormatter.js";

import {
    CLOUDINARY_FOLDERS,
    RESOURCE_TYPES,
} from "../config/constants.js";
import {
  getFileMetadata,
} from "./fileFormatter.js";




export const uploadLectureVideo =
async (
subSectionId,
file
)=>{

const subSection =
await findExistingSubSection(
subSectionId
);

if(
subSection.video?.publicId
){

const uploadResult =
await replaceUploadedFile(

subSection.video?.publicId,

file,

CLOUDINARY_FOLDERS.LECTURE_VIDEOS,

RESOURCE_TYPES.VIDEO

);

}

const uploadResult =
await replaceUploadedFile(

subSection.video?.publicId,

file,

CLOUDINARY_FOLDERS.LECTURE_VIDEOS,

RESOURCE_TYPES.VIDEO

);

const formattedVideo =
formatUploadedFile(
uploadResult
);

subSection.video ={

url:
formattedVideo.url,

publicId:
formattedVideo.publicId,

duration:
formattedVideo.duration,

format:
formattedVideo.format,

size:
formattedVideo.size,

};

await subSection.save();

return{

subSection,

video:
formattedVideo,

};

};

export const findExistingSubSection =
    async (
        subSectionId
    ) => {

        const subSection =
            await SubSection.findById(
                subSectionId
            );

        if (!subSection) {

            const error =
                new Error(
                    "SubSection not found."
                );

            error.statusCode = 404;

            throw error;

        }

        return subSection;

    };

/**
 * Get Lecture Video Metadata
 */
export const getLectureVideoMetadata =
  async (
    subSectionId
  ) => {

    const subSection =
      await findExistingSubSection(
        subSectionId
      );

    return getFileMetadata(
      subSection.video
    );

};




















