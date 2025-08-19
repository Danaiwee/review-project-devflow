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
