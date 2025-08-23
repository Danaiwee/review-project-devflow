"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { ROUTES } from "@/constants/routes";
import { Answer, Question, Vote } from "@/database";

import action from "../handler/action";
import handleError from "../handler/error";
import { NotFoundError } from "../http-errors";
import {
  CreateAnswerSchema,
  DeleteAnswerSchema,
  GetAnswersSchema,
} from "../validations";
import { createInteraction } from "./interaction.action";

export async function createAnswer(
  params: CreateAnswerParams
): Promise<ActionResponse<{ answer: Answer }>> {
  const validationResult = await action({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { content, questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) throw new NotFoundError("Question");

    const [newAnswer] = await Answer.create(
      [
        {
          content,
          author: userId,
          question: question._id,
        },
      ],
      { session }
    );
    if (!newAnswer) throw new Error("Failed to create Answer");

    question.answers += 1;
    await question.save({ session });

    after(async () => {
      await createInteraction({
        authorId: userId as string,
        targetId: newAnswer._id.toString(),
        targetType: "answer",
        action: "post",
      });
    });

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: {
        answer: JSON.parse(JSON.stringify(newAnswer)),
      },
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getAnswers(
  params: GetAnswersParams
): Promise<
  ActionResponse<{ answers: Answer[]; totalAnswers: number; isNext: boolean }>
> {
  const validationResult = await action({
    params,
    schema: GetAnswersSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    filter,
    questionId,
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  let sortCriteria = {};
  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { upvotes: -1 };
      break;
  }
  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        totalAnswers,
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteAnswer(
  params: DeleteAnswerParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const answer = await Answer.findById(answerId).session(session);
    if (!answer) throw new NotFoundError("Answer");

    const question = await Question.findById(
      answer.question.toString()
    ).session(session);
    if (!question) throw new NotFoundError("Question");

    if (answer.author.toString() !== userId)
      throw new Error("You cannot delete this answer");

    await Vote.deleteMany({
      targetId: answer._id,
      targetType: "answer",
    }).session(session);

    question.answers -= 1;
    await question.save({ session });

    after(async () => {
      await createInteraction({
        authorId: userId as string,
        targetId: answer._id.toString(),
        targetType: "answer",
        action: "delete",
      });
    });

    await Answer.findByIdAndDelete(answerId).session(session);

    await session.commitTransaction();

    revalidatePath(ROUTES.PROFILE(userId!));

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
