import { AddWordSetToCollection } from "@api/collectionApi";
import { useAccessToken } from "@context/AccessTokenProvider";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "@hooks/useStatus";
import { useTranslation } from "react-i18next";

function useAddToCollection() {
  const { t: ts } = useTranslation("success");
  const { t: te } = useTranslation("error");
  const { setLoading, loading } = useStatus();
  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();

  const handleAddToCollection = async (collectionId, wordSetId) => {
    setLoading(true);

    try {
      await AddWordSetToCollection(accessToken, collectionId, wordSetId);
      showNotification(ts("COLLECTIONS_ADD_WORDSET_SUCCESS"), "success");
    } catch (error) {
      showNotification(te("COLLECTIONS_ADD_WORDSET_FAILED"), "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { handleAddToCollection, loading };
}

export default useAddToCollection;
