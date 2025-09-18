import React from "react";

import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/empty";

import StateSkeleton from "./StateSkeleton";

interface DataRendererProps<T> {
  success?: boolean;
  error?: {
    message?: string | null;
    details?: Record<string, string[]> | null;
  };
  data: T[] | null | undefined;
  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
}

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: DataRendererProps<T>) => {
  if (!data || data.length === 0 || data === undefined) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "Empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  if (!success) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-error.png",
          dark: "/images/dark-error.png",
          alt: "Error state illustation",
        }}
        title={DEFAULT_ERROR.title || error?.message || ""}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2) //(value, replacer?, space?)
            : DEFAULT_ERROR.message
        }
        button={empty.button}
      />
    );
  }

  return <div>{render(data)}</div>;
};

export default DataRenderer;
