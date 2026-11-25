import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "./useStatus";
import { useTranslation } from "react-i18next";
import { useFetcher } from "@api/fetcher";

function useWordSetPage() {
  const [words, setWords] = useState([]);
  const [wordSet, setWordSet] = useState("");

  const { t: te } = useTranslation("error");
  const { setLoading, loading } = useStatus();
  const { showNotification } = useNotification();
  const { fetcher } = useFetcher();

  const { id } = useParams();

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        const wordsRes = await fetcher({
          url: `/api/v1/words/${id}`,
          method: "GET",
        });
        setWords(wordsRes?.data || []);
        const wordSetsRes = await fetcher({
          url: `/api/v1/wordsets/${id}`,
          method: "GET",
          params: {
            includeUser: true,
            includeCollection: true,
          },
        });
        setWordSet(wordSetsRes?.data || "");
      } catch (error) {
        showNotification(te("FETCH_FAILED"), "error");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [id, setLoading, showNotification, te]);

  return { words, wordSet, loading };
}

export default useWordSetPage;
