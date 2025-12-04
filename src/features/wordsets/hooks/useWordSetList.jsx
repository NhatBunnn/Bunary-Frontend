import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function useWordSetList(initialSort = "popularityScore,desc") {
  const { setLoading } = useAppBase();
  const { fetcher } = useFetcher();

  const [wordSetList, setWordSetList] = useState([]);
  const [pagination, setPagination] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams = Object.fromEntries([...searchParams]);

  const handleFetchWordSetList = async () => {
    const params = {
      sort: queryParams.sort || initialSort,
      keyword: queryParams.keyword || undefined,
      minRating: queryParams.minRating || undefined,
      level: queryParams.level || undefined,
      page: queryParams.page - 1 || 0,
    };

    setLoading(true);
    try {
      const response = await fetcher({
        url: `/api/v1/wordsets`,
        method: "GET",
        params: {
          visibility: "PUBLIC",
          page: 0,
          size: 9,
          ...params,
        },
      });

      setPagination(response.pagination);
      setWordSetList(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateSearchParams = (newParams) => {
    const current = Object.fromEntries([...searchParams]);
    const merged = { ...current, ...newParams };

    const cleaned = Object.entries(merged).filter(
      ([_, v]) => v != null && v !== ""
    );
    setSearchParams(Object.fromEntries(cleaned));
  };

  useEffect(() => {
    handleFetchWordSetList(searchParams);
  }, [searchParams]);

  return {
    wordSetList,
    queryParams,
    pagination,
    handleFetchWordSetList,
    updateSearchParams,
  };
}

export default useWordSetList;
