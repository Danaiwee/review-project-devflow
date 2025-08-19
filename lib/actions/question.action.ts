"use server";
import mongoose from "mongoose";

import { Question, Tag, TagQuestion } from "@/database";

import action from "../handler/action";
import handleError from "../handler/error";
import { AskQuestionSchema } from "../validations";

export async function createQuestion(params: CreateQuestionParams) {
  const validatedData = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }

  const { title, content, tags } = validatedData.params!;
  const userId = validatedData.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newQuestion] = await Question.create(
      [
        {
          title,
          content,
          author: userId,
        },
      ],
      { session }
    );
    if (!newQuestion) throw new Error("Failed to create question");

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        //First parameter (conditions)
        { name: { $regex: new RegExp(`^${tag}$`, "i") } }, //Filter data
        //Second parameter (update)
        {
          $setOnInsert: { name: tag }, //Only set this field if we’re inserting a new document
          $inc: { questions: 1 }, //always increment
        },
        //Third parameter (options)
        {
          upsert: true, //insert a new document if none matches the filter
          new: true, //return the updated document
          session, //mongoose transaction
        }
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: newQuestion._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await Question.findByIdAndUpdate(
      newQuestion._id,
      {
        $push: { tags: { $each: tagIds } }, //push each value to tags array
      },
      { session }
    );

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(newQuestion)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
