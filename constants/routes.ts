export const ROUTES = {
  HOME: "/",
  SIGN_UP: "/sign-up",
  SIGN_IN: "/sign-in",
  ASK_QUESTION: "/ask-question",
  TAGS: "/tags",
  COLLECTION: "/collections",
  COMMUNITY: "/community",
  JOBS: "/jobs",

  TAG: (id: string) => `/tags/${id}`,
  QUESTION: (id: string) => `/questions/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  QUESTION_EDIT: (id: string) => `/questions/${id}/edit`,
};
