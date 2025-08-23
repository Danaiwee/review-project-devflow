import z, { string } from "zod";

export const SignInSchema = z.object({
  email: z
    .email({ message: "Please provide a valid email adress" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const ProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(100, { message: "Username cannot exceed 100 characters" }),
  portfolio: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(150, { message: "Title cannot exceed 150 characters" }),
  content: z
    .string()
    .min(100, { message: "Content must contain al least 100 characters" }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag is required" })
        .max(20, { message: "Tag cannot exceed 20 characters" })
    )
    .min(1, { message: "You have to add at least 1 tag" })
    .max(3, { message: "Maximun 3 tags" }),
});

export const AnswerSchema = z.object({
  content: z
    .string()
    .min(100, { message: "You have to provide mininum of 100 characters" }),
});

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required."),
  username: z.string().min(3, "Username must be at least 6 characters "),
  email: z.email("Invalid email address"),
  bio: z.string().optional(),
  image: z.string().optional(),
  location: z.string().optional(),
  prortfolio: z.url("Invalid portfolio URL").optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
  user: z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.email("Invalid email address"),
    image: z.string().optional(),
  }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().min(1, "Page number is required").default(1),
  pageSize: z.number().min(1, "Page size is required").default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetQuestionParamsSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export const EditQuestionParamsSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, "Question ID is required"),
});

export const IncrementViewsSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export const DeleteQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export const toggleSaveQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export const hasSavedQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export const CreateAnswerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  content: z
    .string()
    .min(20, "Content is required and contain at least 20 characters"),
});

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().min(1, "Question ID is required"),
});

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string().min(1, "Tag ID is required"),
});

export const GetUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const GetUserQuestionsSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().min(1, "User ID is required"),
});

export const GetUserAnswersSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().min(1, "User ID is required"),
});

export const GetUserTopTagsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const EditUserProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().optional(),
  username: z.string().optional(),
  portfoilio: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

export const HasVotedSchema = z.object({
  targetId: z.string().min(1, "Target ID is required"),
  targetType: z.enum(["question", "answer"]),
});

export const CreateVotedSchema = z.object({
  targetId: z.string().min(1, "Target ID is required"),
  targetType: z.enum(["question", "answer"]),
  voteType: z.enum(["upvote", "downvote"]),
});

export const UpdateVoteCountSchema = CreateVotedSchema.extend({
  change: z.number().int().min(-1).max(1),
});

export const AIAnswerSchema = z.object({
  questionTitle: z.string().min(1, "Question title is required"),
  questionContent: z.string().min(1, "Question content is required"),
  userAnswer: z
    .string()
    .min(100, "Answer is required and must contain at least 100 characters"),
});

export const DeleteAnswerSchema = z.object({
  answerId: z.string().min(1, "Answer ID is required"),
});

export const CreateInteractionSchema = z.object({
  action: z.enum([
    "view",
    "upvote",
    "downvote",
    "bookmark",
    "post",
    "edit",
    "delete",
    "search",
  ]),
  targetId: z.string().min(1, "Target ID is required"),
  targetType: z.enum(["question", "answer"]),
  authorId: z.string().min(1, "User ID is required"),
});
