"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { HOMEPAGE_FILTERS } from "@/constants";
import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

const HomeFilter = () => {
  const router = useRouter();
  const searhcParams = useSearchParams();
  const filterParams = searhcParams.get("filter");

  const [active, setActive] = useState(filterParams || "");

  const handleFitlerClick = (value: string) => {
    let newUrl = "";

    if (value === active) {
      setActive("");

      newUrl = removeKeyFromUrlQuery({
        params: searhcParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      setActive(value);

      newUrl = formUrlQuery({
        params: searhcParams.toString(),
        key: "filter",
        value,
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HOMEPAGE_FILTERS.map((item) => (
        <Button
          key={item.name}
          className={cn(
            "body-medium rounded-lg px-6 py-3 capitalize shadow-none",
            active === item.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          )}
          onClick={() => handleFitlerClick(item.value)}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
