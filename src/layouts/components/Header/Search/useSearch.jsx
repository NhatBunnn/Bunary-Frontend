import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import useDebounce from "@hooks/useDebounce";
import { useEffect, useState } from "react";

function useSearch() {
  const { loading, setLoading, te, showNotification } = useAppBase();

  const [keyword, setKeyword] = useState("");

  const deBounced = useDebounce(keyword, 500);

  const [totalResult, setTotalResult] = useState({
    totalWordSet: 0,
    totalUser: 0,
  });
  const [wordsets, setWordSets] = useState([]);
  const [users, setUsers] = useState([]);

  const { fetcher } = useFetcher();

  useEffect(() => {
    if (!deBounced.trim()) {
      setWordSets([]);
      setUsers([]);
      setTotalResult({ totalWordSet: 0, totalUser: 0 });
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);
        const response = await fetcher({
          url: `/api/v1/search`,
          method: "GET",
          params: {
            keyword: deBounced,
          },
        });

        setWordSets(response.data.wordSets);
        setUsers(response.data.users);
        setTotalResult({
          totalWordSet: response.data.totalWordSets,
          totalUser: response.data.totalUsers,
        });
      } catch (e) {
        showNotification(te(e.errorCode) || e.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [deBounced]);

  return { keyword, setKeyword, wordsets, users, totalResult };
}

export default useSearch;
