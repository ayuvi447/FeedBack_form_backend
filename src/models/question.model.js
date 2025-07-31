import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  formID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["mcq", "text", "rating"],
    required: "true",
  },
  options: {
    type: [String],
    required: true,
    default: [],
  },
  isRequired: {
    type: Boolean,
    default: true,
  },
});

export const Question = mongoose.model("Question", questionSchema);
