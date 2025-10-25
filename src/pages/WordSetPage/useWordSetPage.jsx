import { useFetcher } from "@api/fetcher";
import { findWordsByWordSetId } from "@api/wordApi";
import { findWordSetById, removeWordSet } from "@api/wordSetApi";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function useWordSetPage() {
  const { te, setLoading, loading, showNotification, accessToken } =
    useAppBase();

  const [words, setWords] = useState([]);
  const [wordSet, setWordSet] = useState("");
  const [ratingValue, setRatingValue] = useState(5);

  const navigate = useNavigate();
  const { id } = useParams();
  const { fetcher } = useFetcher();

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        const wordsRes = await fetcher({
          url: `/api/v1/wordsets/${id}/words`,
          method: "GET",
          params: {
            page: 0,
            size: 20,
            sort: "id,asc",
          },
        });

        const wordSetsRes = await fetcher({
          url: `/api/v1/wordsets/${id}`,
          method: "GET",
          params: {
            include: "user, collection",
          },
        });

        setWords(wordsRes.data);
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

  const handleRemoveWordSet = async () => {
    try {
      setLoading(true);
      await removeWordSet(accessToken, id);
      showNotification("Xóa bộ từ vựng thành công", "success");
      setTimeout(() => navigate("/learning/mine"), 300);
    } catch (e) {
      showNotification(te(e.errorCode), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingWordSet = async () => {
    try {
      const res = await fetcher({
        url: `/api/v1/wordsets/${wordSet.id}/ratings`,
        method: "POST",
        data: { value: ratingValue },
      });
    } catch (e) {
      showNotification(te(e?.errorCode), "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    words,
    wordSet,
    handleRemoveWordSet,
    handleRatingWordSet,
    ratingValue,
    setRatingValue,
    loading,
  };
}

export default useWordSetPage;
