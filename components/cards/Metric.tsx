import { AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Avatar } from "../ui/avatar";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  imgStyles?: string;
  titleStyles?: string;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  titleStyles,
}: MetricProps) => {
  const nameProfile = alt
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const Content = (
    <>
      {imgUrl ? (
        <Image
          src={imgUrl}
          width={16}
          height={16}
          alt={alt}
          className={`rounded-full object-contain ${imgStyles}`}
        />
      ) : (
        <Avatar className="w-[26px] h-[26px] rounded-full object-cover">
          <AvatarFallback
            className={cn(
              "w-full primary-gradient font-space-grotesk font-bold tracking-wider text-white text-sm flex-center"
            )}
          >
            {nameProfile}
          </AvatarFallback>
        </Avatar>
      )}

      <p className={`${textStyles} flex items-center gap-1`}>{value}</p>
      {title && (
        <span className={`${titleStyles} small-regular line-clamp-1`}>
          {title}
        </span>
      )}
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {Content}
    </Link>
  ) : (
    <div className="flex-center gap-1">{Content}</div>
  );
};

export default Metric;
