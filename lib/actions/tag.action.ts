"use server";

import { FilterQuery } from "mongoose";

import { Question, Tag } from "@/database";

import action from "../handler/action";
import handleError from "../handler/error";
import { NotFoundError } from "../http-errors";
import {
  GetTagQuestionsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function getTags(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> {
  const validationResults = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validationResults instanceof Error) {
    return handleError(validationResults) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, filter, query } = validationResults.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<Tag> = {};
  if (query) {
    filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
  }

  let sortCriteria = {};
  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery);

    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getTagQuestions(
  params: GetTagQuestionsParams
): Promise<
  ActionResponse<{ questions: Question[]; isNext: boolean; tag: Tag }>
> {
  const validationResults = await action({
    params,
    schema: GetTagQuestionsSchema,
  });
  if (validationResults instanceof Error) {
    return handleError(validationResults) as ErrorResponse;
  }

  const { page, pageSize, filter, query, tagId } = validationResults.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<Question> = {
    tags: { $in: [tagId] },
  };
  if (query) {
    filterQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};
  switch (filter) {
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "mostvoted":
      sortCriteria = { upvotes: -1 };
      break;
    case "mostviewed":
      sortCriteria = { views: -1 };
      break;
    case "mostrecent":
      sortCriteria = { createdAt: -1 };
      break;
    case "mostanswered":
      sortCriteria = { answers: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new NotFoundError("Tag");

    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .populate("author", "_id name image")
      .populate("tags", "name")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        tag: JSON.parse(JSON.stringify(tag)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPopularTags(): Promise<
  ActionResponse<{ tags: Tag[] }>
> {
  try {
    const tags = await Tag.find().sort({ questions: -1 }).limit(5);
    if (!tags) throw new NotFoundError("Tags");

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
