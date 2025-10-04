import { findAllCollectionsByCurrentUser } from "@api/collectionApi";
import { useAccessToken } from "@context/AccessTokenProvider";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "@hooks/useStatus";
import { createContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

export const MyCollectionListContext = createContext(null);

function MyCollectionProvider({ children }) {
  const { t: te } = useTranslation("error");
  const { setLoading, loading } = useStatus(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();
  const [myCollections, setMyCollections] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMorePage, setHasMorePage] = useState(true);

  const fetchCollections = useCallback(
    async (pageNumber = 0, size = 10) => {
      try {
        const dataResponse = await findAllCollectionsByCurrentUser(
          accessToken,
          {
            page: pageNumber,
            size,
          }
        );
        const newCollections = dataResponse.data.content;
        setHasMorePage(newCollections.length === size);
        return newCollections;
      } catch (e) {
        showNotification(te(e.errorStatus || "COLLECTIONS_FETCH_FAILED"));
        return [];
      }
    },
    [accessToken, showNotification, te, setLoading]
  );

  async function updateMyCollections(action, payload) {
    switch (action) {
      case "remove":
        setMyCollections((prev) => prev.filter((c) => c.id !== payload.id));
        break;
      case "add":
        setLoading(true);
        const initialCollections = await fetchCollections(0, 5);
        setMyCollections(initialCollections);
        setPage(1);
        setLoading(false);
        break;
      case "loadMore":
        if (!hasMorePage || loadingMore === true) return;

        setLoadingMore(true);
        const moreCollections = await fetchCollections(page, 5);
        setMyCollections((prev) => [...prev, ...moreCollections]);
        setPage((prev) => prev + 1);
        setLoadingMore(false);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    updateMyCollections("add");
  }, [accessToken]);

  return (
    <MyCollectionListContext.Provider
      value={{
        updateMyCollections,
        myCollections,
        loading,
        hasMorePage,
        loadingMore,
      }}
    >
      {children}
    </MyCollectionListContext.Provider>
  );
}

export default MyCollectionProvider;
