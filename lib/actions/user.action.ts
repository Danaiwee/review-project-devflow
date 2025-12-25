"use server";

import { FilterQuery, PipelineStage } from "mongoose";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { ROUTES } from "@/constants/routes";
import { Answer, Question, User } from "@/database";

import action from "../handler/action";
import handleError from "../handler/error";
import { NotFoundError } from "../http-errors";
import { assignBadges } from "../utils";
import {
  EditUserProfileSchema,
  GetUserAnswersSchema,
  GetUserQuestionsSchema,
  GetUserSchema,
  GetUserStatsSchema,
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
      //Keeps only the questions authored by the given userId
      { $match: { author: new mongoose.Types.ObjectId(userId as string) } },

      //Separated data for each tag
      { $unwind: "$tags" },

      //group by tag id and count the amount of that tag
      { $group: { _id: "$tags", count: { $sum: 1 } } },

      //find the tag detail with tag collection and show it in "tagInfo" key (this "tagInfo will be array")
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",// this field will be array
        },
      },

      //Remove the array from tagInfo
      { $unwind: "$tagInfo" },

      //Sort by count (the most count will be the first one)
      { $sort: { count: -1 } },

      //Keep only first 10 data
      { $limit: 10 },

      //Keeps only tagId, name, and count.
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

export async function getUserStats(params: GetUserStatsParams): Promise<
  ActionResponse<{
    totalQuestions: number;
    totalAnswers: number;
    badges: Badges;
  }>
> {
  // 1. Validate Input
  const validationResult = await action({
    params,
    schema: GetUserStatsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    // 2. Run Aggregations in Parallel for speed
    const [questionRes, answerRes] = await Promise.all([
      Question.aggregate([
        { $match: { author: new mongoose.Types.ObjectId(userId as string) } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            upvotes: { $sum: "$upvotes" },
            views: { $sum: "$views" },
          },
        },
      ]),
      Answer.aggregate([
        { $match: { author: new mongoose.Types.ObjectId(userId as string) } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            upvotes: { $sum: "$upvotes" },
          },
        },
      ]),
    ]);

    // 3. Handle the "Empty Array" case with default values
    const questionStats = questionRes[0] || { count: 0, upvotes: 0, views: 0 };
    const answerStats = answerRes[0] || { count: 0, upvotes: 0 };

    // 4. Assign Badges based on retrieved stats
    const badges = assignBadges({
      criteria: [
        { type: "ANSWER_COUNT", count: answerStats.count },
        { type: "QUESTION_COUNT", count: questionStats.count },
        {
          type: "QUESTION_UPVOTES",
          count: questionStats.upvotes,
        },
        {
          type: "ANSWER_UPVOTES",
          count: answerStats.upvotes,
        },
        { type: "TOTAL_VIEWS", count: questionStats.views },
      ],
    });

    // 5. Return the formatted data
    return {
      success: true,
      data: {
        totalQuestions: questionStats.count,
        totalAnswers: answerStats.count,
        badges,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}


//Example for pipeline getUserTopTags function
/*
  1. step 1: filter data 
    syntax:  { $match: { author: new mongoose.Types.ObjectId(userId as string) } },
    example output: 
    [
      {
        "_id": "q1",
        "title": "What is JS?",
        "tags": ["t1", "t2"],
        "author": "user123"
      },
      {
        "_id": "q2",
        "title": "What is TS?",
        "tags": ["t2", "t3"],
        "author": "user123"
      }
    ]

  2. step 2: Splits array of tags into separate documents.
    syntax: { $unwind: "$tags" }
    example output:
    [
      { "_id": "q1", "tags": "t1", "author": "user123" },
      { "_id": "q1", "tags": "t2", "author": "user123" },
      { "_id": "q2", "tags": "t2", "author": "user123" },
      { "_id": "q2", "tags": "t3", "author": "user123" }
    ]

  3. step 3: Groups by tag id, counts occurrences.
    syntax: { $group: { _id: "$tags", count: { $sum: 1 } } }
    example output: 
    [
      { "_id": "t1", "count": 1 },
      { "_id": "t2", "count": 2 },
      { "_id": "t3", "count": 1 }
    ]

  4. step: 4 Join with tags collection.
    syntax: 
    {
      $lookup: {
        from: "tags",
        localField: "_id",
        foreignField: "_id",
        as: "tagInfo"
      }
    }
    
    example output: 
    [
      {
        "_id": "t1",
        "count": 1,
        "tagInfo": [{ "_id": "t1", "name": "javascript", "questions": 10 }]
      },
      {
        "_id": "t2",
        "count": 2,
        "tagInfo": [{ "_id": "t2", "name": "typescript", "questions": 5 }]
      },
      {
        "_id": "t3",
        "count": 1,
        "tagInfo": [{ "_id": "t3", "name": "mongodb", "questions": 7 }]
      }
    ]

  5. step 5: Flatten the tagInfo array.
      syntax: {$unwind: "$tagInfo"}
      example output: 
      [
        { "_id": "t1", "count": 1, "tagInfo": { "_id": "t1", "name": "javascript", "questions": 10 } },
        { "_id": "t2", "count": 2, "tagInfo": { "_id": "t2", "name": "typescript", "questions": 5 } },
        { "_id": "t3", "count": 1, "tagInfo": { "_id": "t3", "name": "mongodb", "questions": 7 } }
      ]

  6. step 6: sort value by count
    syntax: { $sort: { count: -1 } },
    example output: 
    [
      { "_id": "t2", "count": 2, "tagInfo": { "_id": "t2", "name": "typescript", "questions": 5 } },
      { "_id": "t1", "count": 1, "tagInfo": { "_id": "t1", "name": "javascript", "questions": 10 } },
      { "_id": "t3", "count": 1, "tagInfo": { "_id": "t3", "name": "mongodb", "questions": 7 } }
    ]

  7. step 7: Keep only the top 10. (Here we only have 3.)
    syntax: { $limit: 10 }, 

  8. step 8: form the return data
    syntax: 
    {
      _id: "$tagInfo._id",
      name: "$tagInfo.name",
      count: 1
    }
    example output: 
    [
  { "_id": "t2", "name": "typescript", "count": 2 },
  { "_id": "t1", "name": "javascript", "count": 1 },
  { "_id": "t3", "name": "mongodb", "count": 1 }
]

*/

