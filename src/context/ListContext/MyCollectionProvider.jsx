import {
  createCollection,
  findAllCollectionsByCurrentUser,
  removeCollection,
} from "@api/collectionApi";
import { useAccessToken } from "@context/AccessTokenProvider";
import { CreateCollectContext } from "@context/CreateCollectionProvider";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "@hooks/useStatus";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

export const MyCollectionListContext = createContext(null);

function MyCollectionProvider({ children }) {
  const { t: ts } = useTranslation("success");
  const { t: te } = useTranslation("error");
  const { setLoading, loading, setError, error } = useStatus(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();
  const [myCollections, setMyCollections] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMorePage, setHasMorePage] = useState(true);
  const { handleToggleCreateCollect } = useContext(CreateCollectContext);

  const fetchCollections = useCallback(
    async (pageNumber = 0, size = 20) => {
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
    [accessToken, showNotification, te]
  );

  const fetchMyCollections = useCallback(
    async (action, payload) => {
      switch (action) {
        case "remove":
          setLoading(true);
          try {
            await removeCollection(accessToken, payload.id);
            showNotification(ts("COLLECTION_CREATE_SUCCESS"), "success");
            setMyCollections((prev) => prev.filter((c) => c.id !== payload.id));
          } catch (e) {
            showNotification(te(e.errorCode), "error");
            setLoading(false);
          } finally {
            setLoading(false);
          }
          break;

        case "create":
          setError("");
          setLoading(true);

          if (payload.name === "") {
            setError(te("INPUT_NOT_EMPTY"));
            setLoading(false);
            return;
          }

          try {
            await createCollection(accessToken, { name: payload.name });
            showNotification(ts("COLLECTION_CREATE_SUCCESS"), "success");
            fetchMyCollections("fetch");
          } catch (e) {
            showNotification(te(e.errorCode), "error");
            setLoading(false);
          } finally {
            setLoading(false);
            handleToggleCreateCollect(false);
          }
          break;

        case "fetch":
          setLoading(true);
          const initialCollections = await fetchCollections(0, 20);
          setMyCollections(initialCollections);
          setPage(1);
          setLoading(false);
          break;

        case "loadMore":
          if (!hasMorePage || loadingMore) return;

          setLoadingMore(true);
          const moreCollections = await fetchCollections(page, 20);
          setMyCollections((prev) => [...prev, ...moreCollections]);
          setPage((prev) => prev + 1);
          setLoadingMore(false);
          break;

        default:
          break;
      }
    },
    [
      accessToken,
      fetchCollections,
      showNotification,
      ts,
      te,
      handleToggleCreateCollect,
      setLoading,
      setError,
      hasMorePage,
      loadingMore,
      page,
    ]
  );

  async function updateMyCollectionsState(action, payload) {
    switch (action) {
      case "delete":
        setMyCollections((prev) => prev.filter((d) => d.id !== payload.id));
        break;
      case "update":
        fetchMyCollections("fetch");
        break;
      case "create":
        fetchMyCollections("fetch");
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    fetchMyCollections("fetch");
  }, [accessToken, fetchMyCollections]);

  return (
    <MyCollectionListContext.Provider
      value={{
        fetchMyCollections,
        updateMyCollectionsState,
        myCollections,
        loading,
        hasMorePage,
        loadingMore,
        error,
      }}
    >
      {children}
    </MyCollectionListContext.Provider>
  );
}

export default MyCollectionProvider;
