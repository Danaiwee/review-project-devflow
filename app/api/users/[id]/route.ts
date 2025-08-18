import { NextResponse } from "next/server";
import z from "zod";

import { User } from "@/database";
import handleError from "@/lib/handler/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorReponse } from "@/types/global";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();

    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorReponse;
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();

    const user = User.findByIdAndDelete(id);
    if (!user) throw new Error("User not found");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorReponse;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  const body = await request.json();
  const validatedData = UserSchema.partial().safeParse(body);

  if (!validatedData.success) {
    throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);
  }

  try {
    await dbConnect();

    const updatedData = await User.findByIdAndUpdate(id, validatedData.data, {
      new: true,
    });
    if (!updatedData) throw new NotFoundError("User");

    return NextResponse.json(
      { success: true, data: updatedData },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorReponse;
  }
}
