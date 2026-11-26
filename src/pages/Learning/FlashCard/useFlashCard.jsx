import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";

function useFlashCard() {
  const { te, setLoading, loading, showNotification } = useAppBase();
  const [allWords, setAllWords] = useState([]);
  const [dueWords, setDueWords] = useState([]);
  const [studyMode, setStudyMode] = useState("FREE"); // "FREE" | "SM2"
  const [filterMode, setFilterMode] = useState("ALL"); // "ALL" | "DUE"
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const { id } = useParams();
  const { fetcher } = useFetcher();

  const [progress, setProgress] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [sm2Stats, setSm2Stats] = useState({
    againCount: 0,
    hardCount: 0,
    goodCount: 0,
    easyCount: 0,
  });

  const [settings, setSettings] = useState({
    front: {
      term: true,
      ipa: true,
      partOfSpeech: true,
      meaning: false,
      image: true,
    },
    back: {
      term: true,
      ipa: true,
      partOfSpeech: true,
      meaning: true,
      image: true,
    },
  });

  // Lấy cài đặt hiển thị FlashCard
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetcher({
          url: `/api/v1/settings/flashcard`,
          method: "GET",
        });
        if (response?.data?.settings) {
          setSettings(response.data.settings);
        }
      } catch (error) {
        // Dùng mặc định nếu chưa cấu hình
      }
    };
    fetchSettings();
  }, []);

  // Tải danh sách tất cả từ và danh sách từ đến hạn ôn theo thuật toán SM-2
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const wordsRes = await fetcher({
          url: `/api/v1/words/${id}`,
          method: "GET",
          params: { page: 0, size: 500, sort: "id,asc" },
        });
        const wordsList = wordsRes?.data || [];
        setAllWords(wordsList);

        if (wordsList.length > 0) {
          try {
            const sessionRes = await fetcher({
              url: `/api/v1/learning/sessions/start`,
              method: "POST",
              data: { wordSetId: Number(id), stage: 1 },
            });
            setSessionId(sessionRes?.data?.sessionId || null);
          } catch (e) {
            console.error("Failed to start stage 1 session:", e);
          }
        }

        try {
          const dueRes = await fetcher({
            url: `/api/v1/learning/wordsets/${id}/due-words`,
            method: "GET",
          });
          const dueList = dueRes?.data || [];
          const mappedDue = dueList.map((due) => {
            const original = wordsList.find((w) => w.id === due.wordId) || {};
            return {
              ...original,
              ...due,
              id: due.wordId || original.id,
              memoryStatus: due.status,
            };
          });
          setDueWords(mappedDue);
        } catch (e) {
          // Bỏ qua nếu chưa có từ đến hạn
        }
      } catch (error) {
        console.error("Error loading words:", error);
        showNotification(error?.message || "Lỗi tải từ vựng", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setLoading, showNotification]);

  const words = useMemo(() => {
    const baseList =
      studyMode === "SM2" && filterMode === "DUE" && dueWords.length > 0
        ? dueWords
        : allWords;

    if (!isShuffled) return baseList;

    const arr = [...baseList];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [studyMode, filterMode, dueWords, allWords, isShuffled, shuffleSeed]);

  const toggleShuffle = () => {
    setIsShuffled((prev) => !prev);
    setShuffleSeed((prev) => prev + 1);
  };

  const handleGradeWord = async (wordId, grade) => {
    try {
      setSm2Stats((prev) => ({
        ...prev,
        againCount: grade <= 1 ? prev.againCount + 1 : prev.againCount,
        hardCount: grade === 3 ? prev.hardCount + 1 : prev.hardCount,
        goodCount: grade === 4 ? prev.goodCount + 1 : prev.goodCount,
        easyCount: grade >= 5 ? prev.easyCount + 1 : prev.easyCount,
      }));

      await fetcher({
        url: `/api/v1/learning/wordsets/${id}/review-word`,
        method: "POST",
        data: { wordId, grade },
      });
    } catch (e) {
      console.error("SM-2 review error:", e);
    }
  };

  const handleRecordStudy = async () => {
    try {
      // 1. Cập nhật Lộ trình Chặng 1 hoàn thành (không cộng điểm/tiền)
      await fetcher({
        url: `/api/v1/learning/wordsets/${id}/roadmap`,
        method: "PUT",
        data: {
          sessionId,
          step: 1,
          stage1Completed: true,
        },
      });
      window.dispatchEvent(new Event("roadmapUpdated"));

      const totalReviewed =
        sm2Stats.againCount +
        sm2Stats.hardCount +
        sm2Stats.goodCount +
        sm2Stats.easyCount;

      return {
        sm2Stats: totalReviewed > 0 ? sm2Stats : null,
        totalWords: words.length,
        totalReviewed,
      };
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
      return {
        sm2Stats: null,
        totalWords: words.length,
      };
    }
  };

  return {
    words,
    allWords,
    dueWords,
    studyMode,
    setStudyMode,
    filterMode,
    setFilterMode,
    isShuffled,
    toggleShuffle,
    loading,
    settings,
    handleGradeWord,
    handleRecordStudy,
    setProgress,
    sm2Stats,
  };
}

export default useFlashCard;
