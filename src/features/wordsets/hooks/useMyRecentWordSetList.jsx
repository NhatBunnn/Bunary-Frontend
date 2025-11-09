import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";

function useMyRecentWordSetList(initialSort = "popularityScore,desc") {
  const { loading, setLoading } = useAppBase();
  const [recentWordSetList, setRecentWordSetlist] = useState([]);
  const [queryParams, setQueryParams] = useState({ sort: initialSort });

  const { fetcher } = useFetcher();

  const fetchMyRecentWordSetList = async () => {
    setLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v != null && v !== "")
      );

      const response = await fetcher({
        url: `/api/v1/wordsets/history/recent/me`,
        method: "GET",
        params: {
          page: 0,
          size: 6,
          //   ...filteredParams,
        },
      });

      setRecentWordSetlist(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecentWordSetList();
  }, []);

  return {
    recentWordSetList,
    queryParams,
    setQueryParams,
    fetchMyRecentWordSetList,
    loading,
  };
}

export default useMyRecentWordSetList;
