"use server";

import { Answer, Question, Tag, User } from "@/database";

import action from "../handler/action";
import handleError from "../handler/error";
import { NotFoundError } from "../http-errors";
import { GlobalSearchSchema } from "../validations";

export async function globalSearch(params: GlobalSearchParams) {
  const validationResult = await action({
    params,
    schema: GlobalSearchSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const { query, type } = validationResult.params!;

    const regexQuery = { $regex: query, $options: "i" };

    let results = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: User, searchField: "name", type: "user" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeToLowerCase = type?.toLowerCase();

    const availabelSearchTypes = ["question", "answer", "user", "tag"];

    //If no specific type search in all model
    if (!typeToLowerCase || !availabelSearchTypes.includes(typeToLowerCase)) {
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            id: type === "answer" ? item.question : item._id,
            type,
          }))
        );
      }
    } else {
      //In case of type specific
      const modelInfo = modelsAndTypes.find(
        (item) => item.type === typeToLowerCase
      );
      if (!modelInfo) {
        throw new NotFoundError("Model");
      }

      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answer containing ${query}`
            : item[modelInfo.searchField],
        id: type === "answer" ? item.question : item._id,
        type,
      }));
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(results)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
