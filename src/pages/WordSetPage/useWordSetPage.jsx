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

  const navigate = useNavigate();
  const { id } = useParams();

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

  return { words, wordSet, handleRemoveWordSet, loading };
}

export default useWordSetPage;
