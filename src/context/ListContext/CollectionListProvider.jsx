import { getAllCollections } from "@api/collectionApi";
import { useAccessToken } from "@context/AccessTokenProvider";
import { createContext, useEffect, useState } from "react";
import useStatus from "../../hooks/useStatus";
import { useNotification } from "@context/NotificationProvider";
import { useTranslation } from "react-i18next";

export const CollectionListContext = createContext(null);

function CollectionListProvider({ children }) {
  const { t: te } = useTranslation("error");

  const { setLoading, loading } = useStatus();
  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();
  const [collections, setCollections] = useState([]);

  async function updateCollections(action, payload) {
    switch (action) {
      case "remove":
        setCollections((prev) => prev.filter((c) => c.id !== payload.id));
        break;
      case "add":
        setLoading(true);
        try {
          const dataResponse = await getAllCollections(accessToken);
          setCollections(dataResponse.data.content);
        } catch (error) {
          showNotification(te("COLLECTIONS_FETCH_FAILED"));
        } finally {
          setLoading(false);
        }
        break;
      default:
        break;
    }
  }

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
  }, [accessToken, setLoading, showNotification, te]);

  return (
    <CollectionListContext.Provider
      value={{ loading, collections, updateCollections }}
    >
      {children}
    </CollectionListContext.Provider>
  );
}

export default CollectionListProvider;
