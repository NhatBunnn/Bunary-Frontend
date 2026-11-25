import React, { useState, useEffect, useRef } from "react";
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
import useMultipleChoice from "../MultipleChoice/useMultipleChoice";
import FinishScreen from "../components/FinishScreen/FinishScreen";
import { useNavigate, useParams } from "react-router-dom";
import { useFetcher } from "@api/fetcher";

const cx = classNames.bind(styles);

const TestPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetcher } = useFetcher();
  const { words } = useMultipleChoice();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: optionId }
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

  // Tạo câu hỏi trắc nghiệm xáo trộn từ bộ từ
  useEffect(() => {
    if (words && words.length > 0) {
      const qs = generateQuestionsFromWords(words);
      setQuestions(qs);
      setElapsedSeconds(0);
    }
  }, [words]);

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

  function generateQuestionsFromWords(wordsList) {
    if (!wordsList || wordsList.length === 0) return [];
    // Xáo trộn thứ tự các câu hỏi trong bài kiểm tra
    const randomizedWords = shuffle(wordsList);

    return randomizedWords.map((word, index) => {
      const isMeaningToTerm = Math.random() < 0.5;
      const correctText = isMeaningToTerm ? word.term : word.meaning;
      const correctOption = { id: "a", text: correctText, isCorrect: true };

      const wrongTexts = [];
      const maxTries = 25;
      let tries = 0;
      while (wrongTexts.length < 3 && tries < maxTries) {
        tries++;
        const randomWord =
          wordsList[Math.floor(Math.random() * wordsList.length)];
        const candidate = isMeaningToTerm
          ? randomWord.term
          : randomWord.meaning;
        if (
          candidate &&
          candidate !== correctText &&
          !wrongTexts.includes(candidate)
        ) {
          wrongTexts.push(candidate);
        }
      }

      while (wrongTexts.length < 3) {
        wrongTexts.push(
          isMeaningToTerm
            ? `Option #${wrongTexts.length + 1}`
            : `Ý nghĩa dự phòng #${wrongTexts.length + 1}`
        );
      }

      const options = shuffle([
        correctOption,
        { id: "b", text: wrongTexts[0], isCorrect: false },
        { id: "c", text: wrongTexts[1], isCorrect: false },
        { id: "d", text: wrongTexts[2], isCorrect: false },
      ]);

      return {
        id: word.id || index,
        promptLabel: isMeaningToTerm
          ? `Nghĩa: "${word.meaning}"`
          : word.term,
        term: word.term,
        ipa: isMeaningToTerm ? null : word.ipa,
        allowAudio: !isMeaningToTerm,
        question: isMeaningToTerm
          ? `Từ vựng nào mang nghĩa '${word.meaning}'?`
          : `Từ '${word.term}' có nghĩa là gì?`,
        options,
        correctText,
      };
    });
  }

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const handleSelect = (questionId, optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Nộp bài thi Thử thách Trạm 3 & Ghi nhận vào Bảng Vàng
  const handleSubmit = async () => {
    if (isSubmitting || questions.length === 0) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    const avgResponseTimeMs = Math.round(
      (elapsedSeconds * 1000) / Math.max(1, questions.length)
    );

    // Tính điểm và gửi SM-2 review cho từng từ
    questions.forEach(async (q) => {
      const selectedId = answers[q.id];
      const selectedOption = q.options.find((opt) => opt.id === selectedId);
      const isCorrect = Boolean(selectedOption?.isCorrect);
      if (isCorrect) correctCount++;

      if (selectedId) {
        try {
          await fetcher({
            url: `/api/v1/learning/wordsets/${id}/review-word`,
            method: "POST",
            data: {
              wordId: q.id,
              isCorrect,
              responseTimeMs: avgResponseTimeMs,
            },
          });
        } catch (e) {
          console.error("SM-2 review failed for test question:", q.id);
        }
      }
    });

    setScore(correctCount);
    setSubmitted(true);

    const total = questions.length;
    const stage3Score = Math.round((correctCount / total) * 100);

    // Cập nhật Lộ trình Chặng 3 & Đua top Leaderboard
    try {
      await fetcher({
        url: `/api/v1/learning/wordsets/${id}/roadmap`,
        method: "PUT",
        data: {
          step: 3,
          stage3Score,
          stage3DurationSeconds: elapsedSeconds,
        },
      });
      window.dispatchEvent(new Event("roadmapUpdated"));
    } catch (e) {
      console.error("Failed to update roadmap stage 3:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setElapsedSeconds(0);
    if (words && words.length > 0) {
      setQuestions(generateQuestionsFromWords(words));
    }
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

    if (option.isCorrect) return cx("option", "correct");
    if (isSelected && !option.isCorrect) return cx("option", "incorrect");
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
          const selectedId = answers[q.id];
          const selectedOption = q.options.find((opt) => opt.id === selectedId);
          const isCorrect = selectedOption?.isCorrect;

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

              {submitted && !isCorrect && (
                <div className={cx("correction")}>
                  Đáp án chính xác: <strong>{q.correctText}</strong>
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
