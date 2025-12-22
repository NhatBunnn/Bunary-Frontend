import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useState } from "react";
import { useParams } from "react-router-dom";

function useProfileLayout() {
  const { te, setLoading, loading, showNotification } = useAppBase();
  const { fetcher } = useFetcher();

  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [friendStatus, setFriendStatus] = useState("none");

  const { username } = useParams();

  const fetchUserByUserName = async () => {
    setLoading(true);
    try {
      const res = await fetcher({
        url: `/api/v1/users/username/${username}`,
        method: "GET",
      });

      setUser(res.data);
      setProfile(res.data.profile);
      setFriendStatus(res.data.friendshipStatus);
    } catch (error) {
      showNotification(te("FETCH_FAILED"), "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserByUserName,
    user,
    profile,
    loading,
    friendStatus,
    setFriendStatus,
  };
}

export default useProfileLayout;
