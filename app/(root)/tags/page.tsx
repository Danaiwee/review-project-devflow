import { Metadata } from "next";
import React from "react";

import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/data/DataRenderer";
import CommonFilter from "@/components/search/CommonFilter";
import LocalSearchbar from "@/components/search/LocalSearhbar";
import { TAG_FILTERS, TAGS } from "@/constants";
import { EMPTY_TAGS } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "DevFlow | Tags",
  description:
    "Browse and explore tags to find questions, answers, and discussions related to your favorite programming languages, tools, and technologies.",
};

const TagsPage = () => {
  const success = true;
  const error = {
    message: null,
    details: null,
  };

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={TAG_FILTERS}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={TAGS}
        empty={EMPTY_TAGS}
        render={(TAGS) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {TAGS.map((tag) => (
              <TagCard
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                questions={tag.questions}
              />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default TagsPage;
