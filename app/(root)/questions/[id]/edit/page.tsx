import { Metadata } from "next";
import React from "react";

import QuestionForm from "@/components/forms/QuestionForm";
import { QUESTIONS } from "@/constants";

export const metadata: Metadata = {
  title: "DevFlow | Edit Question",
  description:
    "Edit and update your existing question, modify content or tags, and improve clarity to get better answers from the community.",
};

const EditQuestionPage = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <QuestionForm question={QUESTIONS[0]} isEdit />
      </div>
    </>
  );
};

export default EditQuestionPage;
