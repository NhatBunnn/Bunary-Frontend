import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";

function useWordSetList(initialSort = "popularityScore,desc") {
  const { setLoading, loading } = useAppBase();
  const { fetcher } = useFetcher();

  const [wordSetList, setWordSetList] = useState([]);
  const [queryParams, setQueryParams] = useState({ sort: initialSort });

  const handleFetchWordSetList = async () => {
    setLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v != null && v !== "")
      );

      const response = await fetcher({
        url: `/api/v1/wordsets`,
        method: "GET",
        params: {
          visibility: "PUBLIC",
          page: 0,
          size: 20,
          ...filteredParams,
        },
      });

      setWordSetList(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchWordSetList();
  }, []);

  return {
    wordSetList,
    queryParams,
    setQueryParams,
    handleFetchWordSetList,
    loading,
  };
}

export default useWordSetList;
