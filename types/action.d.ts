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
