import mongoose from "mongoose";

import { IInteraction } from "@/database/interaction.model";

declare global {
  interface SignInWithOAuthParams {
    provider: "github" | "google";
    providerAccountId: string;
    user: {
      name: string;
      username: string;
      email: string;
      image?: string;
    };
  }

  interface signUpWithCredentialsParams {
    username: string;
    name: string;
    email: string;
    password: string;
  }

  interface SignInWithCredentailsParams {
    email: string;
    password: string;
  }

  interface CreateQuestionParams {
    title: string;
    content: string;
    tags: string[];
  }

  interface PaginatedSearchParams {
    page?: number;
    pageSize?: number;
    query?: string;
    filter?: string;
    sort?: string;
  }

  interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
  }

  interface GetQuestionParams {
    questionId: string;
  }

  interface EditQuestionParams extends CreateQuestionParams {
    questionId: string;
  }

  interface IncrementViewsParams {
    questionId: string;
  }

  interface DeleteQuestionParams {
    questionId: string;
  }

  interface ToggleSaveQuestionParams {
    questionId: string;
  }

  interface HasSavedQuestionParams {
    questionId: string;
  }

  interface CreateAnswerParams {
    content: string;
    questionId: string;
  }

  interface GetAnswersParams extends PaginatedSearchParams {
    questionId: string;
  }

  interface GetTagQuestionsParams extends PaginatedSearchParams {
    tagId: string;
  }

  interface GetUserParams {
    userId: string;
  }

  interface GetUserQuestionsParams extends PaginatedSearchParams {
    userId: string;
  }

  interface GetUserAnswersParams extends PaginatedSearchParams {
    userId: string;
  }

  interface GetUserTopTagsParams {
    userId: string;
  }

  interface EditUserPrfileParams {
    userId: string;
    name?: string;
    username?: string;
    portfolio?: string;
    location?: string;
    bio?: string;
  }

  interface HasVotedParams {
    targetId: string;
    targetType: "question" | "answer";
  }

  interface CreateVoteParams {
    targetId: string;
    targetType: "question" | "answer";
    voteType: "upvote" | "downvote";
  }

  interface UpdateVoteCountParams extends CreateVoteParams {
    change: 1 | -1;
  }

  interface AIAnswerParams {
    questionTitle: string;
    questionContent: string;
    userAnswer: string;
  }

  interface DeleteQuestionParams {
    questionId: string;
  }

  interface DeleteAnswerParams {
    answerId: string;
  }

  interface JobFilterParams {
    query: string;
    page: number;
    location: string;
  }

  interface CreateInteractionParams {
    authorId: string;
    targetId: string;
    targetType: "question" | "answer";
    action: InteractionActionEnums;
  }

  interface UpdateReputationParams {
    interaction: IInteraction;
    session: mongoose.ClientSession;
    performerId: string;
    authorId: string;
  }
}
