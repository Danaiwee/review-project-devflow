export const ROUTES = {
  HOME: "/",
  SIGN_UP: "/sign-up",
  SIGN_IN: "/sign-in",
  ASK_QUESTION: "/ask-question",
  TAGS: "/tags",
  COLLECTION: "/collections",

  TAG: (id: string) => `/tags/${id}`,
  QUESTION: (id: string) => `/questions/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
};
