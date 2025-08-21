import Link from "next/link";
import { Suspense } from "react";

import { ROUTES } from "@/constants/routes";
import { hasVoted } from "@/lib/actions/vote.action";
import { cn, getTimeStamp } from "@/lib/utils";

import Votes from "./Votes";
import Preview from "../editor/Preview";
import UserAvatar from "../navigation/UserAvatar";

interface AnswerCardProps {
  answer: Answer;
  containerClasses?: string;
  showReadMore?: boolean;
  showActionBtns?: boolean;
}

const AnswerCard = async ({
  answer,
  containerClasses,
  showReadMore = false,
  showActionBtns = false,
}: AnswerCardProps) => {
  const { _id, author, content, createdAt, upvotes, downvotes, question } =
    answer;

  const { data } = await hasVoted({
    targetId: _id,
    targetType: "answer",
  });
  const { hasDownvoted, hasUpvoted } = data!;

  return (
    <div
      className={cn("light-border border-b-2 py-10 relative", containerClasses)}
    >
      <span className="hash-span" id={`answer-${_id}`} />

      {showActionBtns && (
        <div className="background-light800 flex-center absolute -right-2 -top-5 size-9 rounded-full">
          EditDeleteAction
        </div>
      )}

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />

          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col ml-1 sm:flex-row sm:items-center"
          >
            <p className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center">
              {author.name ?? "Anonymous"}
            </p>
            <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
              <span className="max-sm:hidden"> • </span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              targetType="answer"
              targetId={_id}
              upvotes={upvotes}
              downvotes={downvotes}
              hasUpvoted={hasUpvoted}
              hasDownvoted={hasDownvoted}
            />
          </Suspense>
        </div>
      </div>

      <Preview content={content} />

      {showReadMore && (
        <Link
          href={`/questions/${question}/#answer-${_id}`}
          className="body-medium relative z-10 font-space-grotesk text-primary-500"
        >
          <p className="mt-1">Read more...</p>
        </Link>
      )}
    </div>
  );
};

export default AnswerCard;
