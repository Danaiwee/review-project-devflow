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
