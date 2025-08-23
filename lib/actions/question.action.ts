"use server";

import mongoose, { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { ROUTES } from "@/constants/routes";
import {
  Answer,
  Question,
  Tag,
  TagQuestion,
  Collection,
  Vote,
} from "@/database";
import { ITagDoc } from "@/database/tag.model";

import action from "../handler/action";
import handleError from "../handler/error";
import { NotFoundError } from "../http-errors";
import dbConnect from "../mongoose";
import {
  AskQuestionSchema,
  DeleteQuestionSchema,
  EditQuestionParamsSchema,
  GetQuestionParamsSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import { createInteraction } from "./interaction.action";

export async function createQuestion(params: CreateQuestionParams) {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newQuestion] = await Question.create(
      [
        {
          title,
          content,
          author: userId,
        },
      ],
      { session }
    );
    if (!newQuestion) throw new Error("Failed to create question");

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        //First parameter (conditions)
        { name: { $regex: new RegExp(`^${tag}$`, "i") } }, //Filter data
        //Second parameter (update)
        {
          $setOnInsert: { name: tag }, //Only set this field if we’re inserting a new document
          $inc: { questions: 1 }, //always increment
        },
        //Third parameter (options)
        {
          upsert: true, //insert a new document if none matches the filter
          new: true, //return the updated document
          session, //mongoose transaction
        }
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: newQuestion._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await Question.findByIdAndUpdate(
      newQuestion._id,
      {
        $push: { tags: { $each: tagIds } }, //push each value to tags array
      },
      { session }
    );

    after(async () => {
      await createInteraction({
        authorId: userId as string,
        targetId: newQuestion._id.toString(),
        targetType: "question",
        action: "post",
      });
    });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(newQuestion)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: FilterQuery<typeof Question> = {};
  let sortCriteria = {};

  try {
    if (query) {
      filterQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    switch (filter) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "unanswered":
        sortCriteria = { createdAt: -1 };
        filterQuery.answers = 0;
        break;
      case "popular":
        sortCriteria = { upvotes: -1 };
        break;
      case "mostviewed":
        sortCriteria = { views: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }

    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

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

export async function getQuestion(
  params: GetQuestionParams
): Promise<ActionResponse<{ question: Question }>> {
  const validationResult = await action({
    params,
    schema: GetQuestionParamsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId)
      .populate("tags", "name")
      .populate("author", "_id name image");
    if (!question) throw new NotFoundError("Question");

    return {
      success: true,
      data: {
        question: JSON.parse(JSON.stringify(question)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getTopQuestions(): Promise<
  ActionResponse<{ questions: Question[] }>
> {
  try {
    await dbConnect();

    const questions = await Question.find()
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    if (!questions) throw new NotFoundError("Questions");

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

//TODO: Review
export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<{ question: Question }>> {
  const validationResult = await action({
    params,
    schema: EditQuestionParamsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId)
      .populate("tags")
      .session(session);
    if (!question) throw new NotFoundError("Question");

    if (question.author.toString() !== userId)
      throw new Error("You cannot edit this question");

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;

      await question.save({ session });
    }

    const lowerTagNames = tags.map((tag) => tag.toLowerCase());
    const existingTagNames = question.tags.map((tag: ITagDoc) =>
      tag.name.toLowerCase()
    );

    const tagsToAdd = tags.filter(
      (tag) => !existingTagNames.includes(tag.toLowerCase())
    );
    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) => !lowerTagNames.includes(tag.name.toLowerCase())
    );

    const newTagDocuments = [];
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const newTag = await Tag.findOneAndUpdate(
          { name: { $regex: tag, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        if (newTag) {
          newTagDocuments.push({ tag: newTag._id, question: questionId });
          question.tags.push(newTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      );

      await TagQuestion.deleteMany(
        {
          tag: { $in: tagIdsToRemove },
          question: questionId,
        },
        { session }
      );

      const tagIdsToRemoveSet = new Set(
        tagIdsToRemove.map((id: mongoose.Types.ObjectId) => id.toString())
      );

      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) => !tagIdsToRemoveSet.has(tag.toString())
      );
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: {
        question: JSON.parse(JSON.stringify(question)),
      },
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.commitTransaction();
  }
}

export async function incrementViews(
  params: IncrementViewsParams
): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({
    params,
    schema: IncrementViewsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new NotFoundError("Question");

    question.views += 1;

    await question.save();

    return {
      success: true,
      data: {
        views: question.views,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteQuestion(
  params: DeleteQuestionParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) throw new NotFoundError("Question");

    if (question.author.toString() !== userId)
      throw new Error("You cannot delete question");

    await Collection.deleteMany({ question: questionId }).session(session);
    await TagQuestion.deleteMany({ question: questionId }).session(session);
    await Vote.deleteMany({
      targetId: questionId,
      targetType: "question",
    }).session(session);

    if (question.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questions: -1 } },
        { session }
      );
    }

    const answers = await Answer.find({ question: questionId }).session(
      session
    );
    if (answers.length > 0) {
      await Answer.deleteMany({ question: questionId }).session(session);

      await Vote.deleteMany({
        targetId: { $in: answers.map((answer) => answer.id) },
        actionType: "answer",
      }).session(session);
    }

    after(async () => {
      await createInteraction({
        authorId: userId as string,
        targetId: question._id.toString(),
        targetType: "question",
        action: "delete",
      });
    });

    await Question.findByIdAndDelete(questionId).session(session);

    await session.commitTransaction();

    revalidatePath(ROUTES.PROFILE(userId!));

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  }
}
