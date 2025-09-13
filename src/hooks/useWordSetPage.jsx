import { useEffect, useState } from "react";
import { API_URL } from "../config/apiConfig";
import { useAccessToken } from "../context/AccessTokenProvider";
import { useParams } from "react-router-dom";
import { useWordSetListProvider } from "../context/WordSetListProvider";

function useWordSetPage() {
  const { loadingToken, accessToken } = useAccessToken();
  const [words, setWords] = useState([]);
  const [wordSet, setWordSet] = useState("");
  const [loadingWords, setLoadingWords] = useState(true);
  const { wordSets, getWordSetById } = useWordSetListProvider();

  const { id } = useParams();

  useEffect(() => {
    if (!wordSets) return;

    setWordSet(getWordSetById(id));
  }, [wordSets, getWordSetById, id]);

  useEffect(() => {
    const fetchWords = async () => {
      setLoadingWords(true);
      try {
        if (!accessToken || loadingToken) return;

        const response = await fetch(`${API_URL}/api/v1/words/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        const dataResponse = await response.json();

        if (dataResponse.statusCode >= 200 && dataResponse.statusCode < 300) {
          setWords(dataResponse.data);
        } else {
          console.log(dataResponse.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingWords(false);
      }
    };

    fetchWords();
  }, [accessToken, loadingToken, id, setLoadingWords]);

  return { words, wordSet, loadingWords };
}

export default useWordSetPage;
