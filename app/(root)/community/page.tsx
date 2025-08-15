import React from "react";

import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/data/DataRenderer";
import CommonFilter from "@/components/search/CommonFilter";
import LocalSearchbar from "@/components/search/LocalSearhbar";
import { USER_FILTERS, USERS } from "@/constants";
import { EMPTY_USERS } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";

const CommunityPage = () => {
  const success = true;
  const error = {
    message: null,
    details: null,
  };

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
        data={USERS}
        empty={EMPTY_USERS}
        render={(USERS) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {USERS.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default CommunityPage;
