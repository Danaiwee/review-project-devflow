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
    url: window.location.pathname, //eg. /questions
    query: queryString,
  });

  //exmaple return /questions/?page=2&pageSize=10
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
