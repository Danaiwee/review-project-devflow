"use server";

import { FilterQuery, PipelineStage } from "mongoose";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { ROUTES } from "@/constants/routes";
import { Answer, Question, User } from "@/database";

import action from "../handler/action";
import handleError from "../handler/error";
import { NotFoundError } from "../http-errors";
import {
  EditUserProfileSchema,
  GetUserAnswersSchema,
  GetUserQuestionsSchema,
  GetUserSchema,
  GetUserTopTagsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof User> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(
  params: GetUserParams
): Promise<ActionResponse<{ user: User }>> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User");

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(
  params: GetUserQuestionsParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, userId } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const totalQuestions = await Question.countDocuments({ author: userId });

    const questions = await Question.find({ author: userId })
      .populate("tags", "name")
      .populate("author", "name image")
      .sort({ upvotes: -1 })
      .skip(skip)
      .limit(limit);
    if (!questions) throw new NotFoundError("Questions");

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserAnswers(
  params: GetUserAnswersParams
): Promise<ActionResponse<{ answers: Answer[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetUserAnswersSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, userId } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const answers = await Answer.find({ author: userId })
      .populate("author", "_id name image")
      .sort({ upvotes: -1 })
      .skip(skip)
      .limit(limit);
    if (!answers) throw new NotFoundError("Answers");

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

//TODO: Review
export async function getUserTopTags(
  params: GetUserTopTagsParams
): Promise<ActionResponse<{ tags: Tag[] }>> {
  const validationResult = await action({
    params,
    schema: GetUserTopTagsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: "$tagInfo._id",
          name: "$tagInfo.name",
          count: 1,
        },
      },
    ];

    const tags = await Question.aggregate(pipeline);

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

export async function editUserProfile(
  params: EditUserPrfileParams
): Promise<ActionResponse<{ user: User }>> {
  const validationResult = await action({
    params,
    schema: EditUserProfileSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    name,
    username,
    portfolio,
    location,
    bio,
    userId: editUserId,
  } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    if (editUserId !== userId) throw new Error("You cannot edit profile");

    const user = await User.findById(editUserId);
    if (!user) throw new NotFoundError("User");

    if (user.username !== username) {
      const isExistingUsername = await User.findOne({ username });
      if (isExistingUsername) throw new Error("Invalid username");

      user.username = username;
    }

    if (user.name !== name) user.name = name;
    if (user.portfolio !== portfolio) user.portfolio = portfolio;
    if (user.location !== location) user.location = location;
    if (user.bio !== bio) user.bio = bio;

    await user.save();

    revalidatePath(ROUTES.PROFILE(editUserId));

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
