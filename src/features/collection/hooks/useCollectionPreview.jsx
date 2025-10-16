import { removeCollection } from "@api/collectionApi";
import { useToken } from "@context/AuthProvider/TokenContext";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "@hooks/useStatus";
import { useTranslation } from "react-i18next";

function useCollectionPreview() {
  const { t: te } = useTranslation("error");
  const { t: ts } = useTranslation("success");
  const { showNotification } = useNotification();
  const { setLoading, loading } = useStatus();
  const { getToken } = useToken();

  const handleRemoveCollection = async (id) => {
    setLoading(true);
    try {
      await removeCollection({ token: await getToken(), collectionId: id });
      showNotification(ts("COLLECTION_CREATE_SUCCESS"), "success");
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
