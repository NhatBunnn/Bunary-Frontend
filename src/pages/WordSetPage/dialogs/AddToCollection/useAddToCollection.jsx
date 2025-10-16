import { useFetcher } from "@api/fetcher";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "@hooks/useStatus";
import { useTranslation } from "react-i18next";

function useAddToCollection() {
  const { t: ts } = useTranslation("success");
  const { t: te } = useTranslation("error");
  const { setLoading, loading } = useStatus();
  const { showNotification } = useNotification();
  const { fetcher } = useFetcher();

  const handleAddToCollection = async (collectionId, wordSetId) => {
    setLoading(true);
    try {
      const response = await fetcher({
        url: `/api/v1/collections/${collectionId}/wordsets/${wordSetId}`,
        method: "POST",
      });

      showNotification(ts("COLLECTIONS_ADD_WORDSET_SUCCESS"), "success");
    } catch (e) {
      showNotification(te(e.errorCode), "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { handleAddToCollection, loading };
}

export default useAddToCollection;
