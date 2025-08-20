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
import { ANSWERS } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";

export const metadata: Metadata = {
  title: "DevFlow | Question Details",
  description:
    "View a detailed question along with all answers, comments, tags, and related discussions, and participate by voting or adding your own answer.",
};

const QuestionPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { data, error } = await getQuestion({ questionId: id });
  const { question } = data!;

  const { _id, author, createdAt, answers, views, tags, content, title } =
    question;

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
                hasVotedPromise=""
              />
            </Suspense>

            <Suspense fallback={<Loader2 className="size-3 animate-spin" />}>
              <SaveQuestion questionId={_id} hasSavedQuestionPromise="" />
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
          page={1}
          isNext={false}
          data={ANSWERS}
          success={true}
          error={error}
          totalAnswers={5}
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
