import qs from "query-string";

interface formUrlQueryParams {
  params: string;
  key: string;
  value: string;
}

interface removeKeyFromUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const formUrlQuery = ({ params, key, value }: formUrlQueryParams) => {
  const queryString = qs.parse(params); //=> '?foo=bar' >> {foo: 'bar'}

  queryString[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  });
};

export const removeKeyFromUrlQuery = ({
  params,
  keysToRemove,
}: removeKeyFromUrlQueryParams) => {
  const queryString = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete queryString[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true }
  );
};
