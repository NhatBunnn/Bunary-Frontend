import { findById, getWordsetsByCollectionId } from "@api/collectionApi";
import { useAccessToken } from "@context/AccessTokenProvider";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "@hooks/useStatus";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

function useCollectionDetail() {
  const { t: te } = useTranslation("error");
  const { setLoading, loading } = useStatus();
  const { showNotification } = useNotification();
  const { accessToken } = useAccessToken();
  const { id } = useParams();
  const [wordSets, setWordSets] = useState([]);
  const [collection, setCollection] = useState();

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const [collectionRes, wordsetsRes] = await Promise.all([
          findById(accessToken, id),
          getWordsetsByCollectionId(accessToken, id),
        ]);
        setCollection(collectionRes.data);
        setWordSets(wordsetsRes.data);

        console.log("wordsetsRes.data ", wordsetsRes.data);
      } catch (error) {
        setLoading(false);
        showNotification(te("FETCH_FAILED"), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [accessToken, id, setLoading, showNotification, te, setCollection]);

  return { loading, wordSets, collection };
}

export default useCollectionDetail;
