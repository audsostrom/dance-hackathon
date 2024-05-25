import mongoose, { Schema, models } from "mongoose";

const quizSchema = new Schema(
  {
    creatorId: {
      type: String,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Quiz = models.Quiz || mongoose.model("Quiz", quizSchema);
export default Quiz;