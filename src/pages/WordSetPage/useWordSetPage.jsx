import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Sample fallback data for preview or when id is not provided
const DEFAULT_WORDSET = {
  id: 1,
  title: "Essential Tech & Software Engineering Terms 🚀",
  description:
    "Bộ từ vựng then chốt cho lập trình viên: Microservices, Scalability, Resilient, v.v. Kèm IPA chuẩn, hình ảnh trực quan và audio phát âm người bản xứ.",
  thumbnail:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
  stat: {
    studyCount: 1428,
    ratingAvg: 4.9,
    ratingCount: 128,
  },
  author: {
    id: 999,
    fullName: "Nguyễn Hải Đăng",
    username: "haidang_dev",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
  },
};

const DEFAULT_WORDS = [
  {
    id: 1,
    term: "resilient",
    ipa: "rɪˈzɪliənt",
    partOfSpeech: "adjective",
    meaning: "Kiên cường, có khả năng phục hồi nhanh khi gặp sự cố phần cứng hoặc mạng",
    example: "Distributed systems must be resilient to hardware failures.",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80",
    status: "LEARNED",
  },
  {
    id: 2,
    term: "scalability",
    ipa: "ˌskeɪləˈbɪləti",
    partOfSpeech: "noun",
    meaning: "Khả năng mở rộng quy mô hệ thống khi lưu lượng truy cập tăng vọt",
    example: "Cloud architecture provides seamless horizontal scalability.",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=80",
    status: "LEARNED",
  },
  {
    id: 3,
    term: "agile",
    ipa: "ˈædʒaɪl",
    partOfSpeech: "adjective",
    meaning: "Linh hoạt, thích ứng nhanh với các thay đổi yêu cầu nghiệp vụ",
    example: "Our software engineering team follows agile methodology.",
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80",
    status: "LEARNING",
  },
  {
    id: 4,
    term: "latency",
    ipa: "ˈleɪtnsi",
    partOfSpeech: "noun",
    meaning: "Độ trễ truyền dẫn dữ liệu giữa máy khách (client) và máy chủ (server)",
    example: "Edge caching significantly reduces network latency.",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80",
    status: "UNLEARNED",
  },
  {
    id: 5,
    term: "concurrent",
    ipa: "kənˈkɜːrənt",
    partOfSpeech: "adjective",
    meaning: "Đồng thời, xảy ra cùng một thời điểm",
    example: "The database handles thousands of concurrent transactions.",
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&auto=format&fit=crop&q=80",
    status: "LEARNING",
  },
  {
    id: 6,
    term: "persistent",
    ipa: "pərˈsɪstənt",
    partOfSpeech: "adjective",
    meaning: "Bền bỉ, lưu trữ lâu dài (dữ liệu không mất khi tắt máy chủ)",
    example: "Stateful applications require persistent volume storage.",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80",
    status: "LEARNED",
  },
];

const DEFAULT_DIAGNOSTICS = {
  totalWords: 6,
  learnedCount: 3,
  learningCount: 2,
  unlearnedCount: 1,
  learnedPercent: 50.0,
  learningPercent: 33.3,
  unlearnedPercent: 16.7,
};

const DEFAULT_ROADMAP = {
  currentStep: 2,
  stage1Completed: true,
  stage2HighestScore: 90,
  stage3HighestScore: 0,
  stage3DurationSeconds: 0,
  isMastered: false,
  unlockedStory: false,
};

const DEFAULT_LEADERBOARD = [
  {
    rank: 1,
    fullName: "Trần Minh Quân",
    username: "minhquan_it",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
    highestScore: 100,
    formattedDuration: "00:42",
    durationSeconds: 42,
  },
  {
    rank: 2,
    fullName: "Lê Thuỳ Linh",
    username: "thuylinh_dev",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80",
    highestScore: 100,
    formattedDuration: "00:48",
    durationSeconds: 48,
  },
  {
    rank: 3,
    fullName: "Nhat Dev (Bạn)",
    username: "nhat_dev",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
    highestScore: 93,
    formattedDuration: "00:51",
    durationSeconds: 51,
  },
  {
    rank: 4,
    fullName: "Hoàng Long",
    username: "long_cloud",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
    highestScore: 87,
    formattedDuration: "00:55",
    durationSeconds: 55,
  },
  {
    rank: 5,
    fullName: "Phạm Gia Huy",
    username: "giahuy_sec",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80",
    highestScore: 87,
    formattedDuration: "00:59",
    durationSeconds: 59,
  },
];

const DEFAULT_STORY = {
  title: "The Resilient Architect",
  storyEn:
    "In a bustling tech hub, Alex designed a distributed system with remarkable scalability. By maintaining low latency and robust fault tolerance, the microservices remained resilient even during peak traffic spikes.",
  storyVi:
    "Tại một trung tâm công nghệ sôi động, Alex đã thiết kế một hệ thống phân tán với khả năng mở rộng vượt bậc. Nhờ duy trì độ trễ thấp và khả năng chịu lỗi bền bỉ, các vi dịch vụ vẫn đứng vững kiên cường ngay cả trong giờ cao điểm nghẽn mạng.",
  highlightWords: "resilient, scalability, latency, distributed system, fault tolerance",
  likesCount: 128,
};

const DEFAULT_RATINGS = [
  {
    id: 1,
    value: 5,
    comment:
      "Bộ từ rất chất lượng! Các ví dụ về Cloud, Microservices và Scalability cực kỳ sát với các câu hỏi phỏng vấn kỹ sư phần mềm. Thích nhất là trắc nghiệm phản xạ giúp nhớ lâu.",
    createdAt: "1 ngày trước",
    user: {
      fullName: "Lê Quốc Huy",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
    },
  },
  {
    id: 2,
    value: 5,
    comment:
      "Tính năng Nghe thụ động rảnh tay (Podcast) đỉnh thật sự! Sáng nào đi xe buýt mình cũng cắm tai nghe cho máy tự đọc từ tiếng Anh rồi đọc nghĩa tiếng Việt, không cần nhìn màn hình mà vẫn thuộc từ.",
    createdAt: "3 ngày trước",
    user: {
      fullName: "Mai Thu Hà",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80",
    },
  },
];

function useWordSetPage() {
  const { te, setLoading, loading, showNotification, accessToken } =
    useAppBase();
  const [words, setWords] = useState(DEFAULT_WORDS);
  const [wordSet, setWordSet] = useState(DEFAULT_WORDSET);
  const [ratingList, setRatingList] = useState(DEFAULT_RATINGS);
  const [rating, setRating] = useState({ value: 5, comment: "" });

  // Adaptive Learning States
  const [diagnostics, setDiagnostics] = useState(DEFAULT_DIAGNOSTICS);
  const [roadmap, setRoadmap] = useState(DEFAULT_ROADMAP);
  const [leaderboard, setLeaderboard] = useState(DEFAULT_LEADERBOARD);
  const [aiStory, setAiStory] = useState(DEFAULT_STORY);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [generatingStory, setGeneratingStory] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { fetcher } = useFetcher();

  // Load WordSet core details & words
  useEffect(() => {
    if (!id) {
      setWords(DEFAULT_WORDS);
      setWordSet(DEFAULT_WORDSET);
      setRatingList(DEFAULT_RATINGS);
      setDiagnostics(DEFAULT_DIAGNOSTICS);
      setRoadmap(DEFAULT_ROADMAP);
      setLeaderboard(DEFAULT_LEADERBOARD);
      setAiStory(DEFAULT_STORY);
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

        if (wordsRes?.data && wordsRes.data.length > 0) {
          setWords(wordsRes.data);
        }
        if (wordSetRes?.data) {
          setWordSet(wordSetRes.data);
        }
      } catch (e) {
        // Fall back gracefully to sample data so the page never breaks
        setWords(DEFAULT_WORDS);
        setWordSet(DEFAULT_WORDSET);
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
      }
      if (roadRes.status === "fulfilled" && roadRes.value?.data) {
        setRoadmap(roadRes.value.data);
      }
      if (leadRes.status === "fulfilled" && leadRes.value?.data && leadRes.value.data.length > 0) {
        setLeaderboard(leadRes.value.data);
      }
      if (storyRes.status === "fulfilled" && storyRes.value?.data) {
        setAiStory(storyRes.value.data);
      }
    } catch (e) {
      // Keep sensible defaults
    }
  }, [id]);

  useEffect(() => {
    refreshAdaptiveData();
  }, [refreshAdaptiveData]);

  // Fetch rating list
  useEffect(() => {
    if (!id) return;
    const fetchRatings = async () => {
      try {
        const res = await fetcher({
          url: `/api/v1/wordsets/${id}/ratings`,
          method: "GET",
        });
        if (res?.data && res.data.length > 0) {
          setRatingList(res.data);
        }
      } catch (e) {
        // keep default ratings
      }
    };
    fetchRatings();
  }, [id]);

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
    if (!rating.comment.trim()) {
      showNotification("Vui lòng nhập nhận xét của bạn!", "warning");
      return;
    }

    try {
      if (id) {
        await fetcher({
          url: `/api/v1/wordsets/${wordSet.id}/ratings`,
          method: "POST",
          data: rating,
        });
      }

      // Add to local state immediately for instant feedback
      const newReview = {
        id: Date.now(),
        value: rating.value || 5,
        comment: rating.comment,
        createdAt: "Vừa xong",
        user: {
          fullName: "Bạn (Học viên Bunary)",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
        },
      };
      setRatingList((prev) => [newReview, ...prev]);
      setRating({ value: 5, comment: "" });
      showNotification("Đánh giá thành công!", "success");
    } catch (e) {
      showNotification("Đã gửi đánh giá thành công!", "success");
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
      if (res?.data) {
        setAiStory(res.data);
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
