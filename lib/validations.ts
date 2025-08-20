import z from "zod";

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
  portfolio: z.string().url({ message: "Please provide a valid URL" }),
  location: z.string().min(3, { message: "Please provide proper location" }),
  bio: z.string().min(3, { message: "bio must must be at least 3 characters" }),
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
