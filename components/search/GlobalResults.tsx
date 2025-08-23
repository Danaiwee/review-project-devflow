"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { globalSearch } from "@/lib/actions/global.action";

import GlobalFilter from "./GlobalFilter";

const GlobalResults = () => {
  const searchParams = useSearchParams();

  const globalParams = searchParams.get("global");
  const typeParams = searchParams.get("type") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      setResults([]);
      setIsLoading(true);

      try {
        const response = await globalSearch({
          query: globalParams as string,
          type: typeParams,
        });

        setResults(response.data);
      } catch (error) {
        console.log(error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (globalParams) {
      fetchResults();
    }
  }, [globalParams, typeParams]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/questions/${id}`;
      case "answer":
        return `/questions/${id}`;
      case "user":
        return `/profile/${id}`;
      case "tag":
        return `/tags/${id}`;
    }
  };

  return (
    <div className="absolute top-full mt-3 z-10 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <GlobalFilter />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />
      <div className="spce-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>

        {isLoading ? (
          <div className="flex-center flex-col px-5 mt-5">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark-200_light800 body-regular mt-2">
              Browsing the whole database...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-3 mx-4">
            {results.length > 0 ? (
              results.map((item: GlobalResultType, index) => (
                <Link
                  key={item.type + item.id + index}
                  href={renderLink(item.type, item.id) as string}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                >
                  <Image
                    src="/icons/tag.svg"
                    alt="tags"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />

                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-5xl">🫣</p>
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Oops, no results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResults;
