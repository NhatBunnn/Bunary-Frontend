import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCw,
  Clock,
  Trophy,
  Volume2,
  Zap,
  ArrowRight,
  Award,
  Shuffle,
} from "lucide-react";
import classNames from "classnames/bind";
import styles from "./TestPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useFetcher } from "@api/fetcher";
import { useNotification } from "@context/NotificationProvider";

const cx = classNames.bind(styles);

const TestPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetcher } = useFetcher();
  const { showNotification } = useNotification();

  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: optionId }
  const [resultsMap, setResultsMap] = useState({}); // { questionId: { selectedOptionId, correctOptionId, isCorrect } }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);

  // Phát âm chuẩn Anh - Mỹ
  const handleSpeak = (e, text) => {
    e?.stopPropagation();
    if (!text || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Khởi tạo phiên thi Trạm 3 và nhận đề thi đã random từ Backend (không kèm đáp án đúng)
  const startStage3Session = useCallback(async () => {
    try {
      const res = await fetcher({
        url: `/api/v1/learning/sessions/start`,
        method: "POST",
        data: { wordSetId: Number(id), stage: 3 },
      });
      const data = res?.data;
      setSessionId(data?.sessionId || null);
      setQuestions(data?.questions || []);
      setElapsedSeconds(0);
    } catch (e) {
      console.error("Failed to start stage 3 session:", e);
      showNotification(e?.message || "Không thể khởi tạo đề thi Trạm 3", "error");
    }
  }, [fetcher, id, showNotification]);

  useEffect(() => {
    startStage3Session();
  }, [startStage3Session]);

  // Bộ đếm thời gian làm bài (Stopwatch)
  useEffect(() => {
    if (questions.length > 0 && !submitted) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questions.length, submitted]);

  const handleSelect = (questionId, optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Nộp bài thi Thử thách Trạm 3 & Ghi nhận vào Bảng Vàng
  const handleSubmit = async () => {
    if (isSubmitting || submitted || questions.length === 0 || !sessionId) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const avgResponseTimeMs = Math.round(
      (elapsedSeconds * 1000) / Math.max(1, questions.length)
    );

    try {
      const res = await fetcher({
        url: `/api/v1/learning/wordsets/${id}/stage3/submit`,
        method: "POST",
        data: {
          sessionId,
          answers: questions.map((q) => ({
            questionId: q.id,
            selectedOptionId: answers[q.id] || null,
          })),
        },
      });

      const data = res?.data;
      const nextResultsMap = {};
      (data?.results || []).forEach((r) => {
        nextResultsMap[r.questionId] = r;
      });

      setResultsMap(nextResultsMap);
      setScore(data?.correctCount ?? 0);
      if (typeof data?.durationSeconds === "number") {
        setElapsedSeconds(data.durationSeconds);
      }
      setSubmitted(true);
      window.dispatchEvent(new Event("roadmapUpdated"));

      // Ghi nhận phản hồi SM-2 cho từng từ đã chọn dựa trên kết quả BE chấm
      questions.forEach(async (q) => {
        const selectedId = answers[q.id];
        const result = nextResultsMap[q.id];
        if (selectedId && result) {
          try {
            await fetcher({
              url: `/api/v1/learning/wordsets/${id}/review-word`,
              method: "POST",
              data: {
                wordId: q.id,
                isCorrect: Boolean(result.isCorrect),
                responseTimeMs: avgResponseTimeMs,
              },
            });
          } catch (e) {
            console.error("SM-2 review failed for test question:", q.id);
          }
        }
      });
    } catch (e) {
      console.error("Failed to submit stage 3:", e);
      showNotification(e?.message || "Nộp bài thất bại, vui lòng thử lại!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setResultsMap({});
    setSubmitted(false);
    setScore(0);
    setElapsedSeconds(0);
    startStage3Session();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getOptionClasses = (questionId, option) => {
    const selectedId = answers[questionId];
    const isSelected = selectedId === option.id;

    if (!submitted) {
      return cx("option", { selected: isSelected });
    }

    const result = resultsMap[questionId];
    if (result?.correctOptionId === option.id) return cx("option", "correct");
    if (isSelected && !result?.isCorrect) return cx("option", "incorrect");
    return cx("option", "faded");
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-5">
        Đang chuẩn bị đề thi kiểm tra từ vựng...
      </div>
    );
  }

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const percentage = submitted ? Math.round((score / total) * 100) : 0;

  return (
    <div className={cx("container")}>
      {/* Header bài thi & Đồng hồ bấm giờ */}
      <div className={cx("header")}>
        <div className={cx("headerMeta")}>
          <span className={cx("stageBadge")}>
            Trạm 3: Thử thách áp lực cao
          </span>
          <div className={cx("metaActions")}>
            {!submitted && (
              <button
                className={cx("shuffleTestBtn")}
                onClick={handleRestart}
                title="Xáo trộn lại toàn bộ câu hỏi và bắt đầu lại"
              >
                <Shuffle size={14} />
                <span>Xáo trộn đề</span>
              </button>
            )}
            <div className={cx("timerBox")}>
              <Clock size={16} />
              <span>Thời gian: {formatTime(elapsedSeconds)}</span>
            </div>
          </div>
        </div>

        <h1 className={cx("title")}>Kiểm tra năng lực từ vựng</h1>
        <p className={cx("subtitle")}>
          Hoàn thành {total} câu hỏi để đánh giá độ thành thạo và ghi danh vào
          Bảng Vàng Cao Thủ!
        </p>

        {submitted ? (
          <div className={cx("resultBanner")}>
            <div className={cx("resultScore")}>
              <Award size={32} className={cx("awardIcon")} />
              <div>
                <h3 className="mb-0 fw-bold">
                  {score}/{total} câu đúng ({percentage}%)
                </h3>
                <p className="mb-0 small text-muted">
                  Thời gian hoàn thành: {formatTime(elapsedSeconds)} • Điểm đã được lưu vào Bảng Vàng!
                </p>
              </div>
            </div>
            <div className={cx("resultActions")}>
              <button onClick={handleRestart} className={cx("restartBtn")}>
                <RotateCw size={16} />
                <span>Thi lại</span>
              </button>
              <button
                onClick={() => navigate(`/wordset/${id}`)}
                className={cx("leaderboardBtn")}
              >
                <Trophy size={16} />
                <span>Xem Bảng Vàng & Lộ trình</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={cx("progressStatus")}>
            <div className="d-flex justify-content-between mb-1 small text-muted">
              <span>Đã trả lời: {answeredCount}/{total} câu</span>
              <span>{Math.round((answeredCount / total) * 100)}%</span>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-primary"
                style={{ width: `${(answeredCount / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Danh sách câu hỏi */}
      <div className={cx("questions-list")}>
        {questions.map((q, index) => {
          const result = resultsMap[q.id];
          const isCorrect = Boolean(result?.isCorrect);
          const correctText = q.options.find(
            (opt) => opt.id === result?.correctOptionId
          )?.text;

          return (
            <div key={q.id} className={cx("question-item")}>
              <div className={cx("question-header")}>
                <span className={cx("question-number")}>
                  Câu {index + 1}.
                </span>
                <span className={cx("term")}>{q.promptLabel || q.term}</span>
                {q.ipa && (
                  <span className={cx("ipa")}>/{q.ipa}/</span>
                )}
                {q.allowAudio !== false && (
                  <button
                    className={cx("audioBtn")}
                    onClick={(e) => handleSpeak(e, q.term)}
                    title="Nghe phát âm"
                  >
                    <Volume2 size={18} />
                  </button>
                )}

                {submitted && (
                  <span
                    className={cx("resultBadge", isCorrect ? "correct" : "incorrect")}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 size={16} /> Đúng
                      </>
                    ) : (
                      <>
                        <XCircle size={16} /> Sai
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className={cx("options")}>
                {q.options.map((option, optIdx) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(q.id, option.id)}
                    disabled={submitted}
                    className={getOptionClasses(q.id, option)}
                  >
                    <span className={cx("label")}>
                      {["A", "B", "C", "D"][optIdx] || option.id.toUpperCase()}
                    </span>
                    <span className={cx("optionText")}>{option.text}</span>
                  </button>
                ))}
              </div>

              {submitted && !isCorrect && correctText && (
                <div className={cx("correction")}>
                  Đáp án chính xác: <strong>{correctText}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nút nộp bài */}
      {!submitted && (
        <div className={cx("submitFooter")}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || answeredCount === 0}
            className={cx("submitBtn")}
          >
            {isSubmitting ? (
              <span>Đang chấm điểm...</span>
            ) : (
              <>
                <span>
                  Nộp bài thi ({answeredCount}/{total} câu)
                </span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TestPage;
