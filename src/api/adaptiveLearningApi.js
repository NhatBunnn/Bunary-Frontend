import { fetcher as defaultFetcher } from "./fetcher";

const resolveCall = (arg1, arg2, arg3) => {
  let f = defaultFetcher;
  let wordSetId = null;
  let data = null;

  if (typeof arg1 === "function") {
    f = arg1;
    wordSetId = arg2;
    data = arg3;
  } else {
    wordSetId = arg1;
    data = arg2;
  }
  return { f, wordSetId, data };
};

/**
 * Lấy dữ liệu phân tích chẩn đoán trí nhớ 3 màu (X-quang) của bộ từ vựng
 */
export const getMemoryDiagnostics = async (arg1, arg2) => {
  const { f, wordSetId } = resolveCall(arg1, arg2);
  return await f({
    url: `/api/v1/learning/wordsets/${wordSetId}/diagnostics`,
    method: "GET",
  });
};

/**
 * Lấy trạng thái lộ trình 3 chặng của học viên
 */
export const getRoadmapProgress = async (arg1, arg2) => {
  const { f, wordSetId } = resolveCall(arg1, arg2);
  return await f({
    url: `/api/v1/learning/wordsets/${wordSetId}/roadmap`,
    method: "GET",
  });
};

/**
 * Cập nhật tiến độ lộ trình (kết quả trắc nghiệm / thi thử thách)
 */
export const updateRoadmapProgress = async (arg1, arg2, arg3) => {
  const { f, wordSetId, data } = resolveCall(arg1, arg2, arg3);
  return await f({
    url: `/api/v1/learning/wordsets/${wordSetId}/roadmap`,
    method: "PUT",
    data,
    body: data,
  });
};

/**
 * Lấy Bảng Vàng Cao Thủ Top 5 của bộ từ
 */
export const getLeaderboard = async (arg1, arg2) => {
  const { f, wordSetId } = resolveCall(arg1, arg2);
  return await f({
    url: `/api/v1/learning/wordsets/${wordSetId}/leaderboard`,
    method: "GET",
  });
};

/**
 * Lấy truyện ngắn AI Storyteller đã cache của bộ từ
 */
export const getAiStory = async (arg1, arg2) => {
  const { f, wordSetId } = resolveCall(arg1, arg2);
  return await f({
    url: `/api/v1/learning/wordsets/${wordSetId}/story`,
    method: "GET",
  });
};

/**
 * Gửi đánh giá phản xạ từ vựng SM-2
 */
export const submitWordReview = async (arg1, arg2, arg3) => {
  const { f, wordSetId, data } = resolveCall(arg1, arg2, arg3);
  return await f({
    url: `/api/v1/learning/wordsets/${wordSetId}/review-word`,
    method: "POST",
    data,
    body: data,
  });
};

/**
 * Lấy danh sách từ đến hạn cần ôn hôm nay
 */
export const getWordsDueForReview = async (arg1, arg2) => {
  const { f, wordSetId } = resolveCall(arg1, arg2);
  return await f({
    url: `/api/v1/learning/wordsets/${wordSetId}/due-words`,
    method: "GET",
  });
};
