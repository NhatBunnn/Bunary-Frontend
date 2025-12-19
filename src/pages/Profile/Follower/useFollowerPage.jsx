import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useState } from "react";

function useFollowerPage() {
  const { te, setLoading, loading, showNotification } = useAppBase();
  const { fetcher } = useFetcher();

  const [followers, setFollowers] = useState([]);

  const fetchAllMyFollowers = async (queryParams = {}) => {
    setLoading(true);

    try {
      const response = await fetcher({
        url: `/api/v1/users/me/followers`,
        method: "GET",
        params: { ...queryParams },
      });

      setFollowers(response.data.map((item) => item.follower) || []);
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return { fetchAllMyFollowers, followers, loading };
}

export default useFollowerPage;
