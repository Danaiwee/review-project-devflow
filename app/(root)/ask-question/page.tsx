import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";

export const metadata: Metadata = {
  title: "DevFlow | Ask Question",
  description:
    "Create and submit your programming questions, add relevant tags, and share your query with the developer community for answers.",
};

const AskQuestionPage = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in");
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <QuestionForm />
      </div>
    </>
  );
};

export default AskQuestionPage;
