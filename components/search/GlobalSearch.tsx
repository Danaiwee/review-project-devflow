"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";

import GlobalResults from "./GlobalResults";
import { Input } from "../ui/input";

const GlobalSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const query = searchParams.get("global");

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(query || "");

  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      //If container is exist and when we click outside the container setIsOpen
      if (
        searchContainerRef.current &&
        // @ts-expect-error Property 'contains' does not exist on type 'EventTarget | null'.
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pathname, router, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-2 rounded-xl px-4">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search anything globally..."
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
        />
      </div>

      {isOpen && <GlobalResults />}
    </div>
  );
};

export default GlobalSearch;
