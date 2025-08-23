import { Metadata } from "next";
import React from "react";

import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/data/DataRenderer";
import Pagination from "@/components/data/Pagination";
import CommonFilter from "@/components/search/CommonFilter";
import LocalSearchbar from "@/components/search/LocalSearhbar";
import { TAG_FILTERS } from "@/constants";
import { EMPTY_TAGS } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";
import { getTags } from "@/lib/actions/tag.action";

export const metadata: Metadata = {
  title: "DevFlow | Tags",
  description:
    "Browse and explore tags to find questions, answers, and discussions related to your favorite programming languages, tools, and technologies.",
};

const TagsPage = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, filter, query } = await searchParams;

  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
    query,
  });
  const { tags, isNext } = data || {};

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
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
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

      <Pagination page={Number(page) || 1} isNext={isNext || false} />
    </>
  );
};

export default TagsPage;
