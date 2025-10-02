import { createCollection } from "@api/collectionApi";
import { useAccessToken } from "@context/AccessTokenProvider";
import { CreateCollectContext } from "@context/CreateCollectionProvider";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "@hooks/useStatus";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

function useCreateCollection() {
  const { t: te } = useTranslation("error");
  const { t: ts } = useTranslation("success");
  const { handleToggleCreateCollect } = useContext(CreateCollectContext);

  const { setLoading, loading, setError, error } = useStatus();
  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();

  const handleCreateCollection = async (data) => {
    setError("");
    setLoading(true);

    if (data === "") {
      setError(te("INPUT_NOT_EMPTY"));
      setLoading(false);
      return;
    }

    try {
      await createCollection(accessToken, { name: data });
      showNotification(ts("COLLECTION_CREATE_SUCCESS"), "success");
    } catch (error) {
      showNotification(te("COLLECTION_CREATE_FAILED"), "error");
      setLoading(false);
    } finally {
      setLoading(false);
      handleToggleCreateCollect(false);
    }
  };

  return { handleCreateCollection, loading, error };
}

export default useCreateCollection;
