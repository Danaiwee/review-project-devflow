"use server";

import { Session } from "next-auth";
import z, { ZodError, ZodSchema } from "zod";

import { auth } from "@/auth";

import { UnauthorizedError, ValidationError } from "../http-errors";
import dbConnect from "../mongoose";

interface ActionOptions<T> {
  params: T;
  schema: ZodSchema<T>;
  authorize?: boolean;
}

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  if (params && schema) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(z.flattenError(error).fieldErrors);
      } else {
        return new Error("Schema validation failed");
      }
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }
  }

  await dbConnect();

  return { params, session };
}

export default action;


//Zod error example
/* 
  1. Before flatten
  ZodError {
  issues: [
    {
      code: "too_small",
      minimum: 3,
      type: "string",
      inclusive: true,
      message: "String must contain at least 3 character(s)",
      path: ["username"]
    },
    {
      code: "invalid_string",
      validation: "email",
      message: "Invalid email",
      path: ["email"]
    },
    {
      code: "too_small",
      minimum: 6,
      type: "string",
      inclusive: true,
      message: "String must contain at least 6 character(s)",
      path: ["password"]
    }
  ]
}

  2.After flatten
  {
  formErrors: [],
  fieldErrors: {
    username: ["String must contain at least 3 character(s)"],
    email: ["Invalid email"],
    password: ["String must contain at least 6 character(s)"]
  }
}
*/
