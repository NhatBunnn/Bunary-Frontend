import { getAllCollections } from "@api/collectionApi";
import { useAccessToken } from "@context/AccessTokenProvider";
import { useEffect, useState } from "react";
import useStatus from "./useStatus";
import { useNotification } from "@context/NotificationProvider";
import { useTranslation } from "react-i18next";

function useCollectionList() {
  const { t: te } = useTranslation("error");

  const { error, setError, setLoading, loading } = useStatus();
  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    setLoading(true);
    const getCollections = async () => {
      try {
        const dataResponse = await getAllCollections(accessToken);
        setCollections(dataResponse.data.content);
      } catch (error) {
        showNotification(te("COLLECTIONS_FETCH_FAILED"));
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getCollections();
  }, [accessToken, setError, setLoading]);

  return { loading, collections };
}

export default useCollectionList;
