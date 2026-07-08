import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    format: {
      type: String,
    },

    size: {
      type: Number,
    },

    duration: {
      type: Number,
    },
  },
  {
    _id: false,
  }
);

export default fileSchema;