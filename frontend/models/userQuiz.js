import mongoose, { Schema, models } from "mongoose";

const userQuizSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    quizId: {
      type: String,
      required: true,
    },
    responses: {
      type: Array,
      required: true,
    }
  },
  { timestamps: true }
);

const UserQuiz = models?.UserQuiz || mongoose.model("UserQuiz", userQuizSchema);
export default UserQuiz;