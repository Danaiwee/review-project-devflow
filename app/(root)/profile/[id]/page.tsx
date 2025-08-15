import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

import AnswerCard from "@/components/cards/AnswerCard";
import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/data/DataRenderer";
import UserAvatar from "@/components/navigation/UserAvatar";
import ProfileLink from "@/components/profile/ProfileLink";
import Stats from "@/components/profile/Stats";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ANSWERS, QUESTIONS, TAGS, USERS } from "@/constants";
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/empty";

const ProfilePage = () => {
  const user = USERS[3];
  const id = "u4";
  const success = true;
  const error = {
    message: null,
    details: null,
  };
  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={user._id}
            name={user.name}
            imageUrl={user.image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark-100_light900">{user.name}</h2>
            <p className="paragraph-regular text-dark500_light400">
              @{user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {user.portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  href={user.portfolio}
                  title={user.portfolio}
                />
              )}

              {user.location && (
                <ProfileLink
                  imgUrl="/icons/location.svg"
                  title={user.location}
                />
              )}

              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={dayjs(user.createdAt).format("MMMM YYYY")}
              />
            </div>

            {user?.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-5">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {user._id === id && (
            <Link href="/profile/edit">
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={20}
        totalAnswers={50}
        badges={{ GOLD: 0, SILVER: 0, BRONZE: 0 }}
        reputationPoints={100}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              success={success}
              error={error}
              data={QUESTIONS}
              empty={EMPTY_QUESTION}
              render={(QUESTIONS) => (
                <div className="flex w-full flex-col gap-6">
                  {QUESTIONS.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))}
                </div>
              )}
            />
          </TabsContent>

          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <DataRenderer
              success={success}
              error={error}
              data={ANSWERS}
              empty={EMPTY_ANSWERS}
              render={(ANSWERS) => (
                <div className="flex w-full flex-col gap-10">
                  {ANSWERS.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      answer={answer}
                      containerClasses="card-wrapper rounded-[10px] p-9 sm:px-11"
                      showActionBtns={user._id === answer.author._id}
                      showReadMore
                    />
                  ))}
                </div>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tags</h3>

          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              success={success}
              error={error}
              data={TAGS}
              empty={EMPTY_TAGS}
              render={(TAGS) => (
                <div className="mt-3 flex w-full flex-col gap-4">
                  {TAGS.map((tag) => (
                    <TagCard
                      key={tag._id}
                      _id={tag._id}
                      name={tag.name}
                      questions={tag.questions}
                      showCount
                      compact
                    />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
