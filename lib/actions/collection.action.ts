"use server";

import { revalidatePath } from "next/cache";

import { ROUTES } from "@/constants/routes";
import { Collection, Question } from "@/database";

import action from "../handler/action";
import handleError from "../handler/error";
import { NotFoundError } from "../http-errors";
import {
  hasSavedQuestionSchema,
  toggleSaveQuestionSchema,
} from "../validations";

export async function toggleSaveQuestion(
  params: ToggleSaveQuestionParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: toggleSaveQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new NotFoundError("Question");

    const collection = await Collection.findOne({
      question: question._id,
      author: userId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);

      revalidatePath(ROUTES.QUESTION(questionId));

      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await Collection.create({
      question: question._id,
      author: userId,
    });

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSavedQuestion(
  params: HasSavedQuestionParams
): Promise<ActionResponse<{ hasSaved: boolean }>> {
  const validationResult = await action({
    params,
    schema: hasSavedQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    return {
      success: true,
      data: {
        hasSaved: !!collection,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
