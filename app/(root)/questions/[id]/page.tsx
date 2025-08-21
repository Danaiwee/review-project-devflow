import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { after } from "next/server";
import React, { Suspense } from "react";

import AllAnswers from "@/components/answers/AllAnswers";
import Metric from "@/components/cards/Metric";
import SaveQuestion from "@/components/cards/SaveQuestion";
import TagCard from "@/components/cards/TagCard";
import Votes from "@/components/cards/Votes";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import UserAvatar from "@/components/navigation/UserAvatar";
import { ROUTES } from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";

export const metadata: Metadata = {
  title: "DevFlow | Question Details",
  description:
    "View a detailed question along with all answers, comments, tags, and related discussions, and participate by voting or adding your own answer.",
};

const QuestionPage = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, filter } = await searchParams;

  const { data: questionData } = await getQuestion({ questionId: id });
  const { question } = questionData!;
  const { _id, author, createdAt, answers, views, tags, content, title } =
    question;

  const {
    success: answersSuccess,
    data: answersData,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
  });
  const {
    totalAnswers,
    answers: allAnswers,
    isNext: answersIsNext,
  } = answersData || {};

  const { data } = await hasVoted({
    targetId: _id,
    targetType: "question",
  });
  const { hasUpvoted, hasDownvoted } = data!;

  const hasSavedQuestionPromise = hasSavedQuestion({
    questionId: _id,
  });

  after(async () => {
    await incrementViews({ questionId: id });
  });

  return (
    <>
      <section className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author?._id}
              name={author?.name}
              imageUrl={author?.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700 ml-1">
                {author.name}
              </p>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Suspense fallback={<Loader2 className="size-3 animate-spin" />}>
              <Votes
                targetType="question"
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                targetId={_id}
                hasUpvoted={hasUpvoted}
                hasDownvoted={hasDownvoted}
              />
            </Suspense>

            <Suspense fallback={<Loader2 className="size-3 animate-spin" />}>
              <SaveQuestion
                questionId={_id}
                hasSavedQuestionPromise={hasSavedQuestionPromise}
              />
            </Suspense>
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </section>

      <section className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title="Answers"
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title="Views"
          textStyles="small-regular text-dark400_light700"
        />
      </section>

      <Preview content={content} />

      <section className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </section>

      <section className="my-5">
        <AllAnswers
          page={Number(page) || 1}
          isNext={answersIsNext || false}
          data={allAnswers}
          success={answersSuccess}
          error={answersError}
          totalAnswers={totalAnswers || 0}
        />
      </section>

      <section className="my-5">
        <AnswerForm
          questionId={_id}
          questionTitle={title}
          questionContent={content}
        />
      </section>
    </>
  );
};

export default QuestionPage;
