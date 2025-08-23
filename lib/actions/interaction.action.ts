"use server";

import mongoose from "mongoose";

import { Interaction, User } from "@/database";
import { IInteraction } from "@/database/interaction.model";

import action from "../handler/action";
import handleError from "../handler/error";
import { CreateInteractionSchema } from "../validations";

export async function updateReputation(params: UpdateReputationParams) {
  const { interaction, session, performerId, authorId } = params;
  const { targetType, action } = interaction;

  let performerPoints = 0;
  let authorPoints = 0;

  switch (action) {
    case "upvote":
      performerPoints = 2;
      authorPoints = 5;
      break;
    case "downvote":
      performerPoints = -1;
      authorPoints = -2;
      break;
    case "post":
      authorPoints = targetType === "question" ? 5 : 10;
      break;
    case "delete":
      authorPoints = targetType === "question" ? -5 : -10;
      break;
  }

  if (performerId === authorId) {
    await User.findByIdAndUpdate(
      performerId,
      { $inc: { reputation: authorPoints } },
      { session }
    );

    return;
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: performerId },
          update: { $inc: { reputation: performerPoints } },
        },
      },
      {
        updateOne: {
          filter: { _id: authorId },
          update: { $inc: { reputation: authorPoints } },
        },
      },
    ],
    { session }
  );

  return;
}

export async function createInteraction(
  params: CreateInteractionParams
): Promise<ActionResponse<IInteraction>> {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    authorId,
    targetId,
    targetType,
    action: actionType,
  } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interaction] = await Interaction.create(
      [
        {
          user: userId,
          action: actionType,
          targetId,
          targetType,
        },
      ],
      { session }
    );

    await updateReputation({
      authorId,
      performerId: userId!,
      session,
      interaction,
    });

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(interaction)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
