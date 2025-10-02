import { getAllCollections } from "@api/collectionApi";
import { useAccessToken } from "@context/AccessTokenProvider";
import { createContext, useEffect, useState } from "react";
import useStatus from "../hooks/useStatus";
import { useNotification } from "@context/NotificationProvider";
import { useTranslation } from "react-i18next";

export const CollectionListContext = createContext(null);

function CollectionListProvider({ children }) {
  const { t: te } = useTranslation("error");

  const { setLoading, loading } = useStatus();
  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();
  const [collections, setCollections] = useState([]);

  function updateCollections(action, payload) {
    setCollections((prev) => {
      switch (action) {
        case "remove":
          return prev.filter((c) => c.id !== payload.id);
        case "add":
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

        default:
          return prev;
      }
    });
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
