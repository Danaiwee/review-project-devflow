import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/data/DataRenderer";
import CommonFilter from "@/components/search/CommonFilter";
import HomeFilter from "@/components/search/HomeFilter";
import LocalSearchbar from "@/components/search/LocalSearhbar";
import { Button } from "@/components/ui/button";
import { HOMEPAGE_FILTERS, QUESTIONS } from "@/constants";
import { EMPTY_QUESTION } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "DevFlow | Home",
  description:
    "DevFlow is a community-driven Q&A platform for developers to ask questions, share knowledge, and connect with other tech enthusiasts. Discover trending topics, explore tags, and find the best solutions for your coding challenges",
};

const HomePage = () => {
  const success = true;
  const error = {
    message: null,
    details: null,
  };

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION} className="max-sm:w-full">
            Ask a Question
          </Link>
        </Button>
      </section>

      <section className="w-full mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={ROUTES.HOME}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          iconPosition="left"
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={HOMEPAGE_FILTERS}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex justify-end"
        />
      </section>

      <HomeFilter />

      <DataRenderer
        success={success}
        error={error}
        data={QUESTIONS}
        empty={EMPTY_QUESTION}
        render={(QUESTIONS) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {QUESTIONS.map((question) => (
              <QuestionCard key={question._id} question={question} showActionBtns />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default HomePage;
