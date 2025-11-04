import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
function useWordSetPage() {
  const { te, setLoading, loading, showNotification, accessToken } =
    useAppBase();
  const [words, setWords] = useState([]);
  const [wordSet, setWordSet] = useState(null);
  const [ratingList, setRatingList] = useState([]);

  const [rating, setRating] = useState({ value: 0, comment: "" });

  const navigate = useNavigate();
  const { id } = useParams();
  const { fetcher } = useFetcher();

  console.log("ratingList", ratingList);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        const [wordsRes, wordSetRes] = await Promise.all([
          fetcher({
            url: `/api/v1/words/${id}`,
            method: "GET",
            params: { page: 0, size: 20, sort: "id,asc" },
          }),
          fetcher({ url: `/api/v1/wordsets/${id}`, method: "GET" }),
        ]);

        setWords(wordsRes.data);
        setWordSet(wordSetRes.data);
      } catch (e) {
        showNotification(te(e?.errorCode), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [accessToken, id, setLoading, showNotification, te]);

  // fetch rating list
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetcher({
          url: `/api/v1/wordsets/${id}/ratings`,
          method: "GET",
        });
        setRatingList(res.data);
      } catch (e) {
        showNotification(te(e?.errorCode), "error");
      } finally {
      }
    };
    fetchRatings();
  }, []);

  const handleRemoveWordSet = async () => {
    try {
      setLoading(true);
      await fetcher({ url: `/api/v1/wordsets/${id}`, method: "DELETE" });
      setTimeout(() => navigate("/MyWordSets"), 300);
    } catch (e) {
      showNotification(te(e.errorCode), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingWordSet = async () => {
    try {
      setLoading(true);
      await fetcher({
        url: `/api/v1/wordsets/${wordSet.id}/ratings`,
        method: "POST",
        data: rating,
      });
      showNotification("Đánh giá thành công!", "success");
    } catch (e) {
      showNotification(te(e?.errorCode), "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    words,
    wordSet,
    loading,
    rating,
    ratingList,
    setRating,
    handleRatingWordSet,
    handleRemoveWordSet,
  };
}

export default useWordSetPage;
