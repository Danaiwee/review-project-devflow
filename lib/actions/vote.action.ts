"use server";

import mongoose, { ClientSession } from "mongoose";
import { revalidatePath } from "next/cache";

import { ROUTES } from "@/constants/routes";
import { Answer, Question, Vote } from "@/database";

import action from "../handler/action";
import handleError from "../handler/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import {
  CreateVotedSchema,
  HasVotedSchema,
  UpdateVoteCountSchema,
} from "../validations";

export async function hasVoted(
  params: HasVotedParams
): Promise<ActionResponse<{ hasUpvoted: boolean; hasDownvoted: boolean }>> {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      targetId,
      targetType,
      author: userId,
    });

    if (!vote) {
      return {
        success: false,
        data: {
          hasUpvoted: false,
          hasDownvoted: false,
        },
      };
    }

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session: ClientSession
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType, change } = validationResult.params!;

  try {
    const Model = targetType === "question" ? Question : Answer;
    const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session }
    );
    if (!result) throw new Error("Failed to update vote count");

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createVote(
  params: CreateVoteParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreateVotedSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) throw new UnauthorizedError();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const Model = targetType === "question" ? Question : Answer;

    const modelDoc = await Model.findById(targetId).session(session);
    if (!modelDoc) throw new NotFoundError("Document");

    const isExistingVote = await Vote.findOne({
      author: userId,
      targetId,
      targetType,
    }).session(session);

    if (isExistingVote) {
      if (isExistingVote.voteType === voteType) {
        await Vote.findByIdAndDelete(isExistingVote._id).session(session);

        //Update vote count
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType,
            change: -1,
          },
          session
        );
      } else {
        await Vote.findByIdAndUpdate(
          isExistingVote._id,
          { voteType },
          { new: true, session }
        );

        //Update vote count
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType,
            change: 1,
          },
          session
        );

        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType: isExistingVote.voteType,
            change: -1,
          },
          session
        );
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            targetType,
            targetId,
            voteType,
          },
        ],
        { session }
      );

      //Update vote count
      await updateVoteCount(
        {
          targetId,
          targetType,
          voteType,
          change: 1,
        },
        session
      );
    }

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(targetId));

    return {
      success: true,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
