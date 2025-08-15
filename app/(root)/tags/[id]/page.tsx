import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/data/DataRenderer";
import LocalSearchbar from "@/components/search/LocalSearhbar";
import { QUESTIONS, TAGS } from "@/constants";
import { EMPTY_QUESTION } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";

const TagPage = () => {
  const tag = TAGS[0];
  const { _id, name } = tag;
  const success = true;
  const error = {
    message: null,
    details: null,
  };
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">{name}</h1>
      </section>

      <section className="mt-11">
        <LocalSearchbar
          route={ROUTES.TAG(_id)}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={QUESTIONS}
        empty={EMPTY_QUESTION}
        render={(QUESTIONS) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {QUESTIONS.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default TagPage;
