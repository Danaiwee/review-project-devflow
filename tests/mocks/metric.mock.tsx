import React from "react";

import { MockImage } from "./image.mock";

interface MockMetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  imgStyles?: string;
  titleStyles?: string;
}

const MockMetric = ({ imgUrl, alt, value, title, href, textStyles, imgStyles, titleStyles }: MockMetricProps) => {
  return (
    <div className={textStyles} data-testid="metric">
      <MockImage alt={alt} src={imgUrl} />
      {value} {title}
    </div>
  );
};

export { MockMetric };
