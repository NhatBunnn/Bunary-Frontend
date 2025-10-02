import { useEffect, useState } from "react";
import { useAccessToken } from "../context/AccessTokenProvider";
import { useParams } from "react-router-dom";
import { findWordsByWordSetId } from "@api/wordApi";
import { useNotification } from "@context/NotificationProvider";
import useStatus from "./useStatus";
import { useTranslation } from "react-i18next";
import { findWordSetById } from "@api/wordSetApi";

function useWordSetPage() {
  const { accessToken } = useAccessToken();
  const [words, setWords] = useState([]);
  const [wordSet, setWordSet] = useState("");
  // const { wordSets, getWordSetById } = useWordSetListProvider();

  const { t: te } = useTranslation("error");
  const { setLoading, loading } = useStatus();
  const { showNotification } = useNotification();

  const { id } = useParams();

  // useEffect(() => {
  //   const currentWordset = getWordSetById(id);
  //   if (currentWordset) setWordSet(currentWordset);
  // }, [wordSets, getWordSetById, id]);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        const wordsRes = await findWordsByWordSetId(accessToken, id);
        setWords(wordsRes.data);
        const wordSetsRes = await findWordSetById(accessToken, id, {
          includeUser: true,
          includeCollection: true,
        });
        setWordSet(wordSetsRes.data);
      } catch (error) {
        showNotification(te("FETCH_FAILED"), "error");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [accessToken, id, setLoading, showNotification, te]);

  return { words, wordSet, loading };
}

export default useWordSetPage;
