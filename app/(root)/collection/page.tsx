import { Metadata } from "next";
import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/data/DataRenderer";
import CommonFilter from "@/components/search/CommonFilter";
import LocalSearchbar from "@/components/search/LocalSearhbar";
import { COLLECTION_FILTERS, QUESTIONS } from "@/constants";
import { EMPTY_QUESTION } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "DevFlow | Collection",
  description:
    "View and manage all the questions you’ve saved, organized for easy access and quick reference.",
};

const CollectionPage = () => {
  const success = true;
  const error = {
    message: null,
    details: null,
  };

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={ROUTES.COLLECTION}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={COLLECTION_FILTERS}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex max-md:justify-end"
        />
      </div>

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

export default CollectionPage;
