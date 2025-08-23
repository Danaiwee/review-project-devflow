import { Metadata } from "next";
import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/data/DataRenderer";
import Pagination from "@/components/data/Pagination";
import CommonFilter from "@/components/search/CommonFilter";
import LocalSearchbar from "@/components/search/LocalSearhbar";
import { COLLECTION_FILTERS } from "@/constants";
import { EMPTY_QUESTION } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";
import { getSavedQuestions } from "@/lib/actions/collection.action";

export const metadata: Metadata = {
  title: "DevFlow | Collection",
  description:
    "View and manage all the questions you’ve saved, organized for easy access and quick reference.",
};

const CollectionPage = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });
  const { questions, isNext } = data || {};

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
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((item) => (
              <QuestionCard key={item._id} question={item.question} />
            ))}
          </div>
        )}
      />

      <Pagination page={Number(page) || 1} isNext={isNext || false} />
    </>
  );
};

export default CollectionPage;
