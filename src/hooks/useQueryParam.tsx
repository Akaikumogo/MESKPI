import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useQueryParam<T extends string = string>(
  key: string,
  options?: { replace?: boolean }
): [T | null, (value: T | null) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramValue: string | null = searchParams.get(key);

  const setParam = useCallback(
    (value: T | null) => {
      const newParams = new URLSearchParams(searchParams);

      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }

      if (options?.replace) {
        setSearchParams(newParams, { replace: true });
      } else {
        setSearchParams(newParams);
      }
    },
    [key, searchParams, setSearchParams, options]
  );

  return [paramValue as T, setParam];
}
export default useQueryParam;
