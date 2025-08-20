import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import { getQuestion } from "@/lib/actions/question.action";

export const metadata: Metadata = {
  title: "DevFlow | Edit Question",
  description:
    "Edit and update your existing question, modify content or tags, and improve clarity to get better answers from the community.",
};

const EditQuestionPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data } = await getQuestion({ questionId: id });
  const { question } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <QuestionForm question={question} isEdit />
      </div>
    </>
  );
};

export default EditQuestionPage;
