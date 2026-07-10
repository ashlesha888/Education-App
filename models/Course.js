import mongoose from "mongoose";
import fileSchema from "./fileSchema.js";


const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    courseDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    whatYouWillLearn: {
      type: String,
      required: true,
      trim: true,
    },

    courseContent: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Section",
        },
      ],
      default: [],
    },

    ratingAndReviews: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RatingAndReview",
        },
      ],
      default: [],
    },

    averageRating: {
  type: Number,
  default: 0,
},

totalRatings: {
  type: Number,
  default: 0,
},

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(COURSE_STATUS),
      default: "Draft",
    },

    thumbnail: {
  type: fileSchema,
  required: true,
},

    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },

    studentsEnrolled: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    totalStudentsEnrolled: {
    type: Number,
    default: 0,
},
totalDuration: {
    type: Number,
    default: 0,
},
  },
  {
    timestamps: true,
  }
);

courseSchema.index(

{

courseName: "text",

courseDescription: "text",

whatYouWillLearn: "text",

},

{

weights:{

courseName:10,

whatYouWillLearn:6,

courseDescription:3,

},

name:"CourseSearchIndex",

}

);
courseSchema.index({ tag: 1 });

courseSchema.index({ status: 1 });

courseSchema.index({ averageRating: -1 });
courseSchema.index({
  instructor: 1,
  status: 1,
});
courseSchema.index({
  status: 1,
  averageRating: -1,
});
courseSchema.index({
  status: 1,
  price: 1,
});
courseSchema.index({ price: 1 });

const Course = mongoose.model("Course", courseSchema);

export default Course;