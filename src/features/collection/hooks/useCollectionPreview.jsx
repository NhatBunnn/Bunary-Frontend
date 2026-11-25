import { useFetcher } from "@api/fetcher";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "@hooks/useStatus";
import { useTranslation } from "react-i18next";

function useCollectionPreview() {
  const { t: te } = useTranslation("error");
  const { t: ts } = useTranslation("success");
  const { showNotification } = useNotification();
  const { setLoading, loading } = useStatus();
  const { fetcher } = useFetcher();

  const handleRemoveCollection = async (id) => {
    setLoading(true);
    try {
      await fetcher({
        url: `/api/v1/collections/${id}`,
        method: "DELETE",
      });
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
