import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";
import z from "zod";

import { Account, User } from "@/database";
import handleError from "@/lib/handler/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import { APIErrorReponse } from "@/types/global";

export async function POST(request: Request) {
  const body = await request.json();

  const validatedData = SignInWithOAuthSchema.safeParse(body);
  if (!validatedData.success)
    throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { provider, providerAccountId, user } = validatedData.data;
    const { name, username, email, image } = user;

    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      [existingUser] = await User.create(
        [{ name, username: slugifiedUsername, email, image }],
        { session }
      );
    } else {
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData }
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            provider,
            providerAccountId,
            image,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorReponse;
  } finally {
    await session.endSession();
  }
}
