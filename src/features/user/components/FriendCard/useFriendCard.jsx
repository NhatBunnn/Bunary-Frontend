import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useState } from "react";

function useFriendCard() {
  const { te, setLoading, loading, showNotification } = useAppBase();
  const { fetcher } = useFetcher();

  // State
  const [isRequestFriend, setRequestFriend] = useState(false);

  const sendFriendRequest = async (addresseeId) => {
    setLoading(true);
    try {
      await fetcher({
        url: `/api/v1/friends/request/${addresseeId}`,
        method: "POST",
      });
      setRequestFriend(true);
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return { sendFriendRequest,isRequestFriend, loading };
}

export default useFriendCard;
