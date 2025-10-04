import { removeCollection } from "@api/collectionApi";
import { useAccessToken } from "@context/AccessTokenProvider";
import { CollectionListContext } from "@context/ListContext/CollectionListProvider";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "@hooks/useStatus";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

function useCollectionPreview() {
  const { t: te } = useTranslation("error");
  const { t: ts } = useTranslation("success");
  const { showNotification } = useNotification();
  const { setLoading, loading, setError } = useStatus();
  const { accessToken } = useAccessToken();
  const { updateCollections } = useContext(CollectionListContext);

  const handleRemoveCollection = async (id) => {
    setError("");
    setLoading(true);
    try {
      await removeCollection(accessToken, id);
      showNotification(ts("COLLECTION_CREATE_SUCCESS"), "success");
      updateCollections("remove", { id });
    } catch (e) {
      showNotification(te(e.errorCode), "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleRemoveCollection };
}

export default useCollectionPreview;
