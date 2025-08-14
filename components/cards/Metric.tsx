import Image from "next/image";
import Link from "next/link";

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
  const Content = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`rounded-full object-contain ${imgStyles}`}
      />
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
