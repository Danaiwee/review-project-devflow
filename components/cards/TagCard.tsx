import Image from "next/image";
import Link from "next/link";
import React from "react";

import { ROUTES } from "@/constants/routes";
import { getDeviconClassName, getTechDescription } from "@/lib/utils";

import { Badge } from "../ui/badge";

interface TagCardProps {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: TagCardProps) => {
  const iconClass = getDeviconClassName(name);
  const iconDescription = getTechDescription(name);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const Content = (
    <>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 flex flex-row gap-2 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconClass}`}></i>
          <span>{name}</span>
        </div>
      </Badge>

      {remove && (
        <Image
          src="/icons/close.svg"
          width={12}
          height={12}
          alt="class icon"
          className="cursor-pointer object-contain invert-0 dark:invert"
          onClick={handleRemove}
        />
      )}

      {showCount && (
        <p className="small-medium text-dark500_light-700">{questions}+</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button className="flex justify-between gap-2">{Content}</button>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        {Content}
      </Link>
    );
  }

  return <div>TagCard</div>;
};

export default TagCard;
