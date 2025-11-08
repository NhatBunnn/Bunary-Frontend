import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";

function useUserDashboard(initialSort = "id,desc") {
  const { te, setLoading, loading, setError, error, showNotification } =
    useAppBase();
  const { fetcher } = useFetcher();

  const [userList, setUserList] = useState();
  const [queryParams, setQueryParams] = useState({ sort: initialSort });

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      try {
        const filteredParams = Object.fromEntries(
          Object.entries(queryParams).filter(([_, v]) => v != null && v !== "")
        );

        const response = await fetcher({
          url: `/api/v1/admin/users`,
          method: "GET",
          params: {
            page: 0,
            size: 20,
            ...filteredParams,
          },
        });
        setUserList(response.data);
      } catch (e) {
        showNotification(te(e.errorCode) || e.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { userList };
}

export default useUserDashboard;
