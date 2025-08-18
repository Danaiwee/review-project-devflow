import { NextResponse } from "next/server";
import z from "zod";

import { User } from "@/database";
import handleError from "@/lib/handler/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorReponse } from "@/types/global";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorReponse;
  }
}

export async function POSTS(request: Request) {
  try {
    const body = await request.json();

    const validatedData = UserSchema.safeParse(body);
    if (!validatedData.success) {
      throw new ValidationError(
        z.flattenError(validatedData.error).fieldErrors
      );
    }

    await dbConnect();

    const { email, username } = validatedData.data;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw new Error("Email is already exists");

    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error("Username is already exists");

    const newUser = await User.create(validatedData.data);
    if (!newUser) throw new Error("Failed to create new user");

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error) as APIErrorReponse;
  }
}
