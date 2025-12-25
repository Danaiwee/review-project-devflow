"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";
import { AnswerSchema } from "@/lib/validations";

import Editor from "../editor/Editor";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

interface AnswerFormProps {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

const AnswerForm = ({
  questionId,
  questionTitle,
  questionContent,
}: AnswerFormProps) => {
  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleCreateAnswer = (data: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      if (session.status !== "authenticated") {
        toast("Error", {
          description: "Please log in to submit your answer",
        });
        return;
      }

      const result = await createAnswer({
        content: data.content,
        questionId,
      });

      if (result.success) {
        toast("Success", { description: "Created answer successfully" });

        form.reset();
        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast("Error", { description: "An unexpected error occurred" });
      }
    });
  };

  const handleGenerateAI = async () => {
    if (session.status !== "authenticated") {
      return toast("Error", {
        description: "Please log in to use AI generate",
      });
    }

    setIsAISubmitting(true);

    const userAnswer = editorRef.current?.getMarkdown() || "";

    try {
      const { success, data } = await api.ai.AIAnswer({
        questionTitle,
        questionContent,
        userAnswer,
      });

      if (!success) {
        return toast("Error", {
          description: "Sorry, AI help only improve your answer. You need to provide at least 100 characters",
        });
      }

      const formattedAnswer =
        typeof data === "string" ? data.replace(/<br>/g, " ").trim() : "";

      if (editorRef.current) {
        editorRef.current.setMarkdown(formattedAnswer);

        form.setValue("content", formattedAnswer);
        form.trigger("content");
      }

      toast("Success", { description: "AI geerated answer successfully" });
    } catch (error) {
      console.log(error);
      toast("Error", { description: "Error in generating AI answer" });
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmitting}
          onClick={handleGenerateAI}
        >
          {isAISubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-5">
                  <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button className="primary-gradient w-fit text-primary-100">
              {isAnswering ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AnswerForm;
