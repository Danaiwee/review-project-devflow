"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";

import { Input } from "../ui/input";

interface LocalSearchbarProps {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
  iconPosition?: "left" | "right";
}

const LocalSearchbar = ({
  route,
  imgSrc,
  placeholder,
  otherClasses,
  iconPosition = "left",
}: LocalSearchbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [searchQuery, setSearchQuery] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchParams, router, route, pathname]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={20}
          height={20}
          alt="Search"
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={18}
          height={18}
          alt="Search"
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
