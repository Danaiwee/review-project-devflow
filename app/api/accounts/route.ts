import { NextResponse } from "next/server";
import z from "zod";

import { Account } from "@/database";
import handleError from "@/lib/handler/error";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

//Get all accounts
export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find();
    if (!accounts) throw new NotFoundError("Account");

    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorReponse;
  }
}

//Create account
export async function POST(request: Request) {
  const body = await request.json();

  const validatedData = AccountSchema.safeParse(body);
  if (!validatedData.success) {
    throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);
  }

  try {
    await dbConnect();

    const isExistingAccount = await Account.findOne({
      provider: validatedData.data.provider,
      providerAccountId: validatedData.data.providerAccountId,
    });
    if (isExistingAccount)
      throw new ForbiddenError("An account is already exists");

    const newAccount = await Account.create(validatedData.data);
    if (!newAccount) throw new Error("Failed to create account");

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorReponse;
  }
}
