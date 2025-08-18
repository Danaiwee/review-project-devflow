import { Document, model, models, Schema, Types } from "mongoose";

export interface IAnswer {
  content: string;
  author: Types.ObjectId;
  question: Types.ObjectId;
  upvotes: number;
  downvotes: number;
}

export interface IAnswerDoc extends IAnswer, Document {}

const answerSchema = new Schema<IAnswer>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Answer = models?.Answer || model<IAnswer>("Answer", answerSchema);

export default Answer;
