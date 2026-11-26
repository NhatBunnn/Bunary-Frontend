import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useCallback, useEffect, useState } from "react";

function useMyWordSetList() {
  const { loading, setLoading } = useAppBase();
  const [myWordSetList, setMyWordSetlist] = useState([]);

  const { fetcher } = useFetcher();

  const fetchMyWordSets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetcher({
        url: "/api/v1/wordsets/me",
        method: "GET",
        params: {
          page: 0,
          size: 20,
          sort: "id,desc",
        },
      });
      setMyWordSetlist(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [fetcher, setLoading]);

  useEffect(() => {
    fetchMyWordSets();
  }, [fetchMyWordSets]);

  const updateWordSetInList = useCallback((updated) => {
    if (!updated?.id) return;
    setMyWordSetlist((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
    );
  }, []);

  return { myWordSetList, loading, refetch: fetchMyWordSets, updateWordSetInList };
}

export default useMyWordSetList;
