import React from "react";

import QuestionForm from "@/components/forms/QuestionForm";
import { QUESTIONS } from "@/constants";

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
