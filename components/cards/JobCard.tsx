import Image from "next/image";
import Link from "next/link";

import { processJobTitle } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

interface JobLocationProps {
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

const JobLocation = ({
  job_city,
  job_state,
  job_country,
}: JobLocationProps) => {
  return (
    <div className="background-light800_darkgradient flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
      <Image
        src={`https://flagsapi.com/${job_country}/flat/64.png`}
        alt="Country symbol"
        width={16}
        height={16}
        className="rounded-full"
      />

      <p className="body-medium text-dark400_light700">
        {job_city && `${job_city}, `}
        {job_state && `${job_state}, `}
        {job_country && `${job_country}`}
      </p>
    </div>
  );
};

const JobCard = ({ job }: JobCardProps) => {
  const {
    employer_logo,
    employer_website,
    job_employment_type,
    job_title,
    job_description,
    job_apply_link,
    job_city,
    job_state,
    job_country,
  } = job;
  return (
    <section className="background-light900_dark200 light-border shadow-light100_darknone flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8">
      <div className="flex w-full justify-end sm:hidden">
        <JobLocation
          job_city={job_city}
          job_state={job_state}
          job_country={job_country}
        />
      </div>

      <div className="flex items-center gap-6">
        {employer_logo ? (
          <Link
            href={employer_website ?? "/jobs"}
            className="background-light800_dark400 relative size-16 rounded-xl"
          >
            <Image
              src="/images/site-logo.svg"
              alt="company logo"
              fill
              className="size-full object-contain p-2"
            />
          </Link>
        ) : (
          <Image
            src="/images/site-logo.svg"
            alt="default site logo"
            width={64}
            height={64}
            className="rounded-[10px]"
          />
        )}
      </div>

      <div className="w-full">
        <div className="flex-between flex-wrap gap-2">
          <p className="base-semibold text-dark200_light900">
            {processJobTitle(job_title)}
          </p>

          <div className="hidden sm:flex">
            <JobLocation
              job_city={job_city}
              job_state={job_state}
              job_country={job_country}
            />
          </div>
        </div>

        <p className="body-regular text-dark500_light700 mt-2 line-clamp-2">
          {job_description?.slice(0, 200)}
        </p>

        <div className="flex-between mt-12 flex-wrap gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/clock-2.svg"
                alt="clock"
                width={20}
                height={20}
              />

              <p className="body-medium text-light-500">
                {job_employment_type}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/icons/currency-dollar-circle.svg"
                alt="dollar symbol"
                width={20}
                height={20}
              />
              <p className="body-medium text-light-500">Not disclosed</p>
            </div>
          </div>

          <Link
            href={job_apply_link ?? "/jobs"}
            target="_blank"
            className="flex items-center gap-2"
          >
            <p className="body-semibold primary-text-gradient">View Job</p>
            <Image
              src="/icons/arrow-up-right.svg"
              alt="arrow up right"
              width={20}
              height={20}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobCard;
