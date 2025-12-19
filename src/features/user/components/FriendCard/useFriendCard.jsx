import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";

function useFriendCard() {
  const { te, setLoading, loading, showNotification } = useAppBase();
  const { fetcher } = useFetcher();

  const toggleFollow = async (followeeId) => {
    setLoading(true);
    try {
      await fetcher({
        url: `/api/v1/users/${followeeId}/follow`,
        method: "POST",
      });
      showNotification("Bạn đã theo dõi người dùng này", "success");
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return { toggleFollow, loading };
}

export default useFriendCard;
