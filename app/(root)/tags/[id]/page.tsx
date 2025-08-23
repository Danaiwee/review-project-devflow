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
import { getTagQuestions } from "@/lib/actions/tag.action";
import { getTechDescription } from "@/lib/utils";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const { success, data } = await getTagQuestions({ tagId: id });
  const { tag } = data || {};
  if (!success) {
    return {
      title: "DevFlow | Tag",
      description:
        "Explore all questions, answers, and discussions related to the tag, and stay updated on trends and best practices.",
    };
  }

  return {
    title: `DevFlow | ${tag?.name}`,
    description: `${getTechDescription(tag?.name || "")}`,
  };
}

const TagPage = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, filter, query } = await searchParams;

  const { success, data, error } = await getTagQuestions({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
    query,
  });

  const { questions, tag, isNext } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={ROUTES.TAG(id)}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={COLLECTION_FILTERS}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex max-md:justify-end"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />

      <Pagination page={Number(page) || 1} isNext={isNext || false} />
    </>
  );
};

export default TagPage;
