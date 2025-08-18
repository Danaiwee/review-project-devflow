import { Error } from "mongoose";
import { NextResponse } from "next/server";
import z from "zod";

import { Account } from "@/database";
import handleError from "@/lib/handler/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { APIErrorReponse } from "@/types/global";

//Get account by ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();

    const account = await Account.findById(id);
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorReponse;
  }
}

//Delete account by id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();

    const account = await Account.findByIdAndDelete(id);
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorReponse;
  }
}

//Update account by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  const body = await request.json();

  const validatedData = AccountSchema.partial().safeParse(body);
  if (!validatedData.success) {
    throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);
  }

  try {
    await dbConnect();

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      validatedData.data,
      { new: true }
    );
    if (!updatedAccount) throw new Error("Failed to update account");

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorReponse;
  }
}
