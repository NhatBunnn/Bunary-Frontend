import { removeCollection } from "@api/collectionApi";
import { useAccessToken } from "@context/AccessTokenProvider";
import { CollectionListContext } from "@context/CollectionListProvider";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "@hooks/useStatus";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

function useCollectionPreview() {
  const { t: te } = useTranslation("error");
  const { t: ts } = useTranslation("success");
  const { showNotification } = useNotification();
  const { setLoading, loading, setError, error } = useStatus();
  const { accessToken } = useAccessToken();
  const { updateCollections } = useContext(CollectionListContext);

  const handleRemoveCollection = async (id) => {
    setError("");
    setLoading(true);
    try {
      await removeCollection(accessToken, id);
      showNotification(ts("COLLECTION_CREATE_SUCCESS"), "success");
      updateCollections("remove", { id });
    } catch (error) {
      showNotification(te("COLLECTION_CREATE_FAILED"), "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleRemoveCollection };
}

export default useCollectionPreview;
