"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import { Account, User } from "@/database";

import action from "../handler/action";
import handleError from "../handler/error";
import { NotFoundError } from "../http-errors";
import { SignInSchema, SignUpSchema } from "../validations";

export async function signUpWithCredentials(
  params: signUpWithCredentialsParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { username, name, email, password } = validationResult.params!;

    const isExistingUserEmail = await User.findOne({ email }).session(session);
    if (isExistingUserEmail) throw new Error("User already exists");

    const isExistingUserUsername = await User.findOne({ username }).session(
      session
    );
    if (isExistingUserUsername) throw new Error("User already exists");

    const [newUser] = await User.create(
      [
        {
          username,
          name,
          email,
        },
      ],
      { session }
    );
    if (!newUser) throw new Error("Failed to create User");

    const hashedPassword = await bcrypt.hash(password, 12);

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          password: hashedPassword,
          provider: "credentials",
          providerAccountId: email,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentials(
  params: SignInWithCredentailsParams
) {
  const validationResult = await action({
    params,
    schema: SignInSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");

    const account = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!account) throw new NotFoundError("Account");

    const isValidPassword = await bcrypt.compare(password, account.password);
    if (!isValidPassword) throw new Error("Invalid password");

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
