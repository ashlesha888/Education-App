import mongoose from "mongoose";
import fileSchema from "./fileModel.js";
const subsectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    timeDuration: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    video: {
      type: fileSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
subsectionSchema.virtual(
"formattedDuration"
).get(function(){

if(
!this.video?.duration
){

return null;

}

const minutes =
Math.floor(
this.video.duration/60
);

const seconds =
this.video.duration%60;

return `${minutes}:${seconds
.toString()
.padStart(2,"0")}`;

});

const Subsection = mongoose.model("Subsection", subsectionSchema);

export default Subsection;