import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import z from "zod";

import handleError from "@/lib/handler/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";

export async function POST(request: Request): Promise<APIResponse<string>> {
  const { questionTitle, questionContent, userAnswer } = await request.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({
      questionTitle,
      questionContent,
      userAnswer,
    });

    if (!validatedData.success) {
      throw new ValidationError(
        z.flattenError(validatedData.error).fieldErrors
      );
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Generate a markdown-formatted response to the following question: "${questionTitle}"
        
        Consider the provided question content:
        **Context** ${questionContent}

        Also, prioritize and incorporate the user's answer when formulating your response:  
        **User's Answer:** ${userAnswer}

        Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the userAnswer point. 
        Provide the final answer in markdown format.
        `,
      system: //how the model should behave
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 }) as APIResponse<string>;
  } catch (error) {
    return handleError(error, "api") as APIErrorReponse;
  }
}
