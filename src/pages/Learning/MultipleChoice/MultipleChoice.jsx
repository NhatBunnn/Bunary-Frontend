import React, { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle2, XCircle, Volume2, ArrowRight, Zap, Shuffle } from "lucide-react";
import classNames from "classnames/bind";
import styles from "./MultipleChoice.module.css";
import useMultipleChoice from "./useMultipleChoice";
import FinishScreen from "../components/FinishScreen/FinishScreen";
import { useNavigate, useParams } from "react-router-dom";
import { useFetcher } from "@api/fetcher";

const cx = classNames.bind(styles);

const MultipleChoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetcher } = useFetcher();
  const { words } = useMultipleChoice();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [speedNotice, setSpeedNotice] = useState("");
  const [sessionId, setSessionId] = useState(null);

  const questionStartTimeRef = useRef(Date.now());

  const startStage2Session = useCallback(async () => {
    try {
      const res = await fetcher({
        url: `/api/v1/learning/sessions/start`,
        method: "POST",
        data: { wordSetId: Number(id), stage: 2 },
      });
      setSessionId(res?.data?.sessionId || null);
    } catch (e) {
      console.error("Failed to start stage 2 session:", e);
    }
  }, [fetcher, id]);

  const handleSpeak = (e, text) => {
    e?.stopPropagation();
    if (!text || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (words && words.length > 0) {
      const qs = generateQuestionsFromWords(words);
      setQuestions(qs);
      questionStartTimeRef.current = Date.now();
      startStage2Session();
    }
  }, [words, startStage2Session]);

  function generateQuestionsFromWords(wordsList) {
    if (!wordsList || wordsList.length === 0) return [];
    // Xáo trộn thứ tự các câu hỏi ngẫu nhiên
    const randomizedWords = shuffle(wordsList);

    return randomizedWords.map((word, index) => {
      // Random dạng câu hỏi: 50% Term -> Meaning, 50% Meaning -> Term
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
        question: isMeaningToTerm
          ? "Từ vựng nào mang nghĩa sau đây?"
          : `Từ '${word.term}' có nghĩa là gì?`,
        word: isMeaningToTerm ? word.meaning : word.term,
        ipa: isMeaningToTerm ? null : word.ipa,
        allowAudio: !isMeaningToTerm,
        options,
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

  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleSelectAnswer = useCallback(
    (optionId) => {
      if (showFeedback) return;
      setSelectedAnswer(optionId);
    },
    [showFeedback]
  );

  const handleSubmitAnswer = useCallback(async () => {
    if (!selectedAnswer || !currentQuestion) return;

    const responseTimeMs = Math.max(500, Date.now() - questionStartTimeRef.current);
    setShowFeedback(true);

    const selectedOption = currentQuestion.options.find(
      (opt) => opt.id === selectedAnswer
    );
    const isCorrect = Boolean(selectedOption?.isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      if (responseTimeMs < 3000) {
        setSpeedNotice("⚡ Phản xạ chớp nhoáng (< 3s) - Trí nhớ rất tốt (+5 SM-2)!");
      } else if (responseTimeMs < 6000) {
        setSpeedNotice("👍 Trả lời chính xác trong chu kỳ chuẩn (+4 SM-2)");
      } else {
        setSpeedNotice("⏳ Trả lời đúng sau suy nghĩ kỹ (+3 SM-2)");
      }
    } else {
      setSpeedNotice("💡 Đã ghi nhận từ này để ưu tiên nhắc ôn lại sớm!");
    }

    try {
      await fetcher({
        url: `/api/v1/learning/wordsets/${id}/review-word`,
        method: "POST",
        data: {
          wordId: currentQuestion.id,
          isCorrect,
          responseTimeMs,
        },
      });
    } catch (e) {
      console.error("Failed to record SM-2 quiz answer:", e);
    }
  }, [selectedAnswer, currentQuestion, fetcher, id]);

  const handleNextQuestion = useCallback(async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setSpeedNotice("");
      questionStartTimeRef.current = Date.now();
    } else {
      const percentage = Math.round((score / questions.length) * 100);

      try {
        await fetcher({
          url: `/api/v1/learning/wordsets/${id}/roadmap`,
          method: "PUT",
          data: {
            sessionId,
            step: 2,
            stage2Score: percentage,
          },
        });
        window.dispatchEvent(new Event("roadmapUpdated"));
      } catch (e) {
        console.error("Failed to update roadmap stage 2:", e);
      }

      setIsTestComplete(true);
    }
  }, [currentIndex, questions.length, score, fetcher, id, sessionId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;

      if (!showFeedback && currentQuestion) {
        if (["Digit1", "KeyA"].includes(e.code) && currentQuestion.options[0]) {
          handleSelectAnswer(currentQuestion.options[0].id);
        } else if (["Digit2", "KeyB"].includes(e.code) && currentQuestion.options[1]) {
          handleSelectAnswer(currentQuestion.options[1].id);
        } else if (["Digit3", "KeyC"].includes(e.code) && currentQuestion.options[2]) {
          handleSelectAnswer(currentQuestion.options[2].id);
        } else if (["Digit4", "KeyD"].includes(e.code) && currentQuestion.options[3]) {
          handleSelectAnswer(currentQuestion.options[3].id);
        } else if (e.code === "Enter" && selectedAnswer) {
          handleSubmitAnswer();
        }
      } else if (showFeedback && e.code === "Enter") {
        handleNextQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showFeedback,
    currentQuestion,
    selectedAnswer,
    handleSelectAnswer,
    handleSubmitAnswer,
    handleNextQuestion,
  ]);

  const handleRestartTest = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setIsTestComplete(false);
    setSpeedNotice("");
    if (words && words.length > 0) {
      setQuestions(generateQuestionsFromWords(words));
      questionStartTimeRef.current = Date.now();
      startStage2Session();
    }
  };

  const getOptionClasses = (option) => {
    const isSelected = selectedAnswer === option.id;

    if (!showFeedback) {
      return cx("option", { selected: isSelected });
    }

    if (option.isCorrect) return cx("option", "correct");
    if (isSelected && !option.isCorrect) return cx("option", "incorrect");
    return cx("option", "faded");
  };

  if (!questions || questions.length === 0) {
    return (
      <div className={cx("loadingState")}>
        Đang chuẩn bị câu hỏi trắc nghiệm...
      </div>
    );
  }

  if (isTestComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const passedStage2 = percentage >= 80;
    return (
      <FinishScreen
        onRestart={handleRestartTest}
        onGoHome={() => navigate(`/wordset/${id}`)}
        stats={{
          point: score * 10,
          spark: Math.max(1, Math.floor(score / 2)),
        }}
        percentage={percentage}
        stageTitle="Trạm 2: Trắc nghiệm phản xạ"
        nextStageLabel={
          passedStage2 ? "Vào thi Thử thách Trạm 3" : undefined
        }
        onNextStage={
          passedStage2 ? () => navigate(`/learning/${id}/test`) : undefined
        }
      />
    );
  }

  return (
    <div className={cx("mcContainer")}>
      {/* Tiến độ */}
      <div className={cx("progressHeader")}>
        <div className={cx("progressMeta")}>
          <span className={cx("counterText")}>
            Câu {currentIndex + 1} / {questions.length}
          </span>
          <div className={cx("metaRight")}>
            <button
              className={cx("shuffleQuizBtn")}
              onClick={handleRestartTest}
              title="Trộn ngẫu nhiên lại bộ câu hỏi"
            >
              <Shuffle size={14} />
              <span>Trộn câu hỏi</span>
            </button>
            <span className={cx("scoreText")}>
              <Zap size={15} /> Đúng: {score}/{questions.length}
            </span>
          </div>
        </div>
        <div className={cx("progressBarBg")}>
          <div
            className={cx("progressBarFill")}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Thẻ câu hỏi */}
      <div className={cx("questionCard")}>
        <div className={cx("cardHeader")}>
          <span className={cx("questionBadge")}>
            Câu hỏi {currentIndex + 1}
          </span>
          {currentQuestion.ipa && (
            <span className={cx("ipaText")}>/{currentQuestion.ipa}/</span>
          )}
        </div>

        <h2 className={cx("questionTitle")}>{currentQuestion.question}</h2>

        <div className={cx("wordHighlight")}>
          <span className={cx("wordTerm")}>{currentQuestion.word}</span>
          {currentQuestion.allowAudio !== false && (
            <button
              className={cx("audioBtn")}
              onClick={(e) => handleSpeak(e, currentQuestion.word)}
              title="Nghe phát âm"
            >
              <Volume2 size={18} />
            </button>
          )}
        </div>

        {/* Các đáp án */}
        <div className={cx("optionsList")}>
          {currentQuestion.options.map((option, idx) => (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={showFeedback}
              className={getOptionClasses(option)}
            >
              <div className={cx("optionContent")}>
                <span className={cx("optionLabel")}>
                  {["A", "B", "C", "D"][idx] || option.id.toUpperCase()}
                </span>
                <span className={cx("optionText")}>{option.text}</span>
              </div>
              {showFeedback && option.isCorrect && (
                <CheckCircle2 size={20} className={cx("iconCorrect")} />
              )}
              {showFeedback &&
                selectedAnswer === option.id &&
                !option.isCorrect && (
                  <XCircle size={20} className={cx("iconIncorrect")} />
                )}
            </button>
          ))}
        </div>

        {/* Phản hồi tức thì */}
        {showFeedback && (
          <div
            className={cx(
              "feedback",
              currentQuestion.options.find(
                (opt) => opt.id === selectedAnswer
              )?.isCorrect
                ? "correctFeedback"
                : "incorrectFeedback"
            )}
          >
            {currentQuestion.options.find(
              (opt) => opt.id === selectedAnswer
            )?.isCorrect ? (
              <>
                <CheckCircle2 size={22} className={cx("iconCorrect")} />
                <div>
                  <strong className={cx("fbTitleCorrect")}>Chính xác! 🎉</strong>
                  <p className={cx("fbDesc")}>{speedNotice}</p>
                </div>
              </>
            ) : (
              <>
                <XCircle size={22} className={cx("iconIncorrect")} />
                <div>
                  <strong className={cx("fbTitleIncorrect")}>
                    Chưa chính xác
                  </strong>
                  <p className={cx("fbDesc")}>
                    Đáp án đúng:{" "}
                    <strong>
                      {
                        currentQuestion.options.find((opt) => opt.isCorrect)
                          ?.text
                      }
                    </strong>
                  </p>
                  <p className={cx("fbSub")}>{speedNotice}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Nút thao tác */}
      <div className={cx("actionFooter")}>
        {!showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className={cx("submitBtn")}
          >
            Kiểm tra đáp án [Enter]
          </button>
        ) : (
          <button onClick={handleNextQuestion} className={cx("nextBtn")}>
            <span>
              {currentIndex < questions.length - 1
                ? "Câu tiếp theo"
                : "Hoàn thành Trạm 2"}
            </span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MultipleChoice;
