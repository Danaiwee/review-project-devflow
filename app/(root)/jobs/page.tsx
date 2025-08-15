import { Metadata } from "next";
import React from "react";

import JobCard from "@/components/cards/JobCard";
import DataRenderer from "@/components/data/DataRenderer";
import JobFilter from "@/components/search/JobFilter";
import LocalSearchbar from "@/components/search/LocalSearhbar";
import { COUNTRIES, JOBS } from "@/constants";
import { EMPTY_JOBS } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "DevFlow | Find Jobs",
  description:
    "Discover the latest developer job opportunities, filter by location and skills, and apply to positions that match your expertise.",
};

const JobsPage = () => {
  const success = true;
  const error = {
    message: null,
    details: null,
  };

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <section className="w-full mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={ROUTES.JOBS}
          imgSrc="/icons/job-search.svg"
          placeholder="Job Title, Company, or Keywords"
          otherClasses="flex-1"
        />

        <JobFilter
          countriesList={COUNTRIES}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex max-md:justify-end"
        />
      </section>

      <DataRenderer
        success={success}
        data={JOBS}
        error={error}
        empty={EMPTY_JOBS}
        render={(JOBS) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {JOBS.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default JobsPage;
