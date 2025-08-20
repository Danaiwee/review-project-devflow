import Image from "next/image";
import Link from "next/link";
import React from "react";

import { TAGS } from "@/constants";
import { EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";
import { getTopQuestions } from "@/lib/actions/question.action";

import TagCard from "../cards/TagCard";
import DataRenderer from "../data/DataRenderer";

const RightSidebar = async () => {
  const { success, data, error } = await getTopQuestions();
  const { questions } = data || {};

  return (
    <aside className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <DataRenderer
          data={questions}
          empty={EMPTY_QUESTION}
          success={success}
          error={error}
          render={(questions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {questions.map((question) => (
                <Link
                  key={question._id}
                  href={ROUTES.QUESTION(question._id)}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="body-medium text-dark500_light700 line-clamp-2">
                    {question.title}
                  </p>
                  <Image
                    src="/icons/chevron-right.svg"
                    alt="chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>

      <div className="mt-10">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <DataRenderer
          data={TAGS}
          empty={EMPTY_TAGS}
          success={success}
          error={error}
          render={(TAGS) => (
            <div className="mt-7 flex flex-col gap-4">
              {TAGS.map((tag) => (
                <TagCard
                  key={tag._id}
                  _id={tag._id}
                  name={tag.name}
                  questions={tag.questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </aside>
  );
};

export default RightSidebar;
