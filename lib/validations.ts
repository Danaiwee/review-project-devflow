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
