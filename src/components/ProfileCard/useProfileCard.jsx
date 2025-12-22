import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";

function useProfileCard() {
  const { te, setLoading, loading, showNotification } = useAppBase();

  const { fetcher } = useFetcher();

  const sendFriendRequest = async (addresseeId, setFriendStatus) => {
    setLoading(true);
    try {
      await fetcher({
        url: `/api/v1/friends/request/${addresseeId}`,
        method: "POST",
      });
      setFriendStatus("PENDING_SENT");
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const unsendFriendRequest = async (addresseeId, setFriendStatus) => {
    setLoading(true);
    try {
      await fetcher({
        url: `/api/v1/friends/request/${addresseeId}`,
        method: "DELETE",
      });
      setFriendStatus("NONE");
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (addresseeId, setFriendStatus) => {
    setLoading(true);
    try {
      await fetcher({
        url: `/api/v1/friends/request/${addresseeId}/accept`,
        method: "POST",
      });
      setFriendStatus("ACCEPTED");
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (addresseeId, setFriendStatus) => {
    setLoading(true);
    try {
      await fetcher({
        url: `/api/v1/friends/request/${addresseeId}/remove`,
        method: "DELETE",
      });
      setFriendStatus("NONE");
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    sendFriendRequest,
    unsendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    loading,
  };
}

export default useProfileCard;
