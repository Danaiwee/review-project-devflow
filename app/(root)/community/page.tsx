import { Metadata } from "next";
import React from "react";

import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/data/DataRenderer";
import Pagination from "@/components/data/Pagination";
import CommonFilter from "@/components/search/CommonFilter";
import LocalSearchbar from "@/components/search/LocalSearhbar";
import { USER_FILTERS } from "@/constants";
import { EMPTY_USERS } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";
import { getUsers } from "@/lib/actions/user.action";

export const metadata: Metadata = {
  title: "DevFlow | Community",
  description:
    "Connect with developers worldwide, explore community members’ profiles, and engage with like-minded tech enthusiasts.",
};

const CommunityPage = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });
  const { users, isNext } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={ROUTES.COMMUNITY}
          imgSrc="/icons/search.svg"
          placeholder="There are some great dev here!"
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={USER_FILTERS}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex max-md:justify-end"
        />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      />

      <Pagination page={Number(page) || 1} isNext={isNext || false} />
    </>
  );
};

export default CommunityPage;
