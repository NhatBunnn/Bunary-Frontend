import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";

function useCollection() {
  const { loading, setLoading, setError, error, te, ts, showNotification } =
    useAppBase();
  const { fetcher } = useFetcher();

  const deleteCollection = async (collectionId) => {
    setLoading(true);
    try {
      const response = await fetcher({
        url: `/api/v1/collections/${collectionId}`,
        method: "DELETE",
      });
    } catch (e) {
      showNotification(te(e.errorCode), "error");
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async ({ name }) => {
    setError("");
    setLoading(true);

    if (name === "") {
      setError(te("INPUT_NOT_EMPTY"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetcher({
        url: "/api/v1/collections",
        method: "POST",
        data: { name },
      });
      showNotification(ts("COLLECTION_CREATE_SUCCESS"), "success");
    } catch (e) {
      showNotification(te(e.errorCode), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCollection = async () => {};
  const handleFetchCollection = async () => {};

  return { loading, error, deleteCollection, createCollection };
}

export default useCollection;
