import { useFetcher } from "@api/fetcher";
import { pollAiQueueTicket } from "@api/aiApi";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

function useWordSetPage() {
  const { te, setLoading, loading, showNotification, accessToken } =
    useAppBase();
  const [words, setWords] = useState([]);
  const [wordSet, setWordSet] = useState(null);
  const [ratingList, setRatingList] = useState([]);
  const [rating, setRating] = useState({ value: 5, comment: "" });

  // Adaptive Learning States
  const [diagnostics, setDiagnostics] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [aiStory, setAiStory] = useState(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [generatingStory, setGeneratingStory] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { fetcher } = useFetcher();

  // Load WordSet core details & words
  useEffect(() => {
    if (!id) {
      setWords([]);
      setWordSet(null);
      setRatingList([]);
      setDiagnostics(null);
      setRoadmap(null);
      setLeaderboard([]);
      setAiStory(null);
      return;
    }

    const fetchWordsAndSet = async () => {
      setLoading(true);
      try {
        const [wordsRes, wordSetRes] = await Promise.all([
          fetcher({
            url: `/api/v1/words/${id}`,
            method: "GET",
            params: { page: 0, size: 50, sort: "id,asc" },
          }),
          fetcher({ url: `/api/v1/wordsets/${id}`, method: "GET" }),
        ]);

        setWords(Array.isArray(wordsRes?.data) ? wordsRes.data : []);
        setWordSet(wordSetRes?.data || null);
      } catch (e) {
        setWords([]);
        setWordSet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWordsAndSet();
  }, [accessToken, id, setLoading, showNotification, te]);

  // Load Adaptive Learning Stats (Diagnostics, Roadmap, Leaderboard, AI Story)
  const refreshAdaptiveData = useCallback(async () => {
    if (!id) return;
    try {
      const [diagRes, roadRes, leadRes, storyRes] = await Promise.allSettled([
        fetcher({
          url: `/api/v1/learning/wordsets/${id}/diagnostics`,
          method: "GET",
        }),
        fetcher({
          url: `/api/v1/learning/wordsets/${id}/roadmap`,
          method: "GET",
        }),
        fetcher({
          url: `/api/v1/learning/wordsets/${id}/leaderboard`,
          method: "GET",
        }),
        fetcher({
          url: `/api/v1/learning/wordsets/${id}/story`,
          method: "GET",
        }),
      ]);

      if (diagRes.status === "fulfilled" && diagRes.value?.data) {
        setDiagnostics(diagRes.value.data);
      } else {
        setDiagnostics(null);
      }

      if (roadRes.status === "fulfilled" && roadRes.value?.data) {
        setRoadmap(roadRes.value.data);
      } else {
        setRoadmap(null);
      }

      if (leadRes.status === "fulfilled" && Array.isArray(leadRes.value?.data)) {
        setLeaderboard(leadRes.value.data);
      } else {
        setLeaderboard([]);
      }

      if (storyRes.status === "fulfilled" && storyRes.value?.data) {
        setAiStory(storyRes.value.data);
      } else {
        setAiStory(null);
      }
    } catch (e) {
      // keep empty states on error
    }
  }, [id]);

  useEffect(() => {
    refreshAdaptiveData();
  }, [refreshAdaptiveData]);

  // Fetch rating list
  const fetchRatings = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetcher({
        url: `/api/v1/wordsets/${id}/ratings`,
        method: "GET",
      });
      setRatingList(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setRatingList([]);
    }
  }, [id]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

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
    if (!id) return;
    if (!rating.comment.trim()) {
      showNotification("Vui lòng nhập nhận xét của bạn!", "warning");
      return;
    }

    try {
      await fetcher({
        url: `/api/v1/wordsets/${wordSet?.id || id}/ratings`,
        method: "POST",
        data: rating,
      });

      setRating({ value: 5, comment: "" });
      showNotification("Đánh giá thành công!", "success");
      await fetchRatings();
    } catch (e) {
      showNotification(te(e?.errorCode) || "Không thể gửi đánh giá lúc này!", "error");
    }
  };

  const generateAiStory = async ({ style, character } = {}) => {
    if (!id) return;
    setGeneratingStory(true);
    try {
      const res = await fetcher({
        url: `/api/v1/learning/wordsets/${id}/story/generate`,
        method: "POST",
        data: { style, character },
      });
      const storyData = res?.data?.ticketId
        ? await pollAiQueueTicket(fetcher, res.data.ticketId)
        : res?.data;
      if (storyData) {
        setAiStory(storyData);
        showNotification("Đã tạo truyện tranh AI 9 cảnh thành công!", "success");
      }
    } catch (e) {
      showNotification(
        e?.message || "Không thể tạo truyện tranh AI lúc này",
        "error"
      );
    } finally {
      setGeneratingStory(false);
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

    // Adaptive Learning additions
    diagnostics,
    roadmap,
    leaderboard,
    aiStory,
    isStoryModalOpen,
    setIsStoryModalOpen,
    generatingStory,
    generateAiStory,
    refreshAdaptiveData,
  };
}

export default useWordSetPage;
