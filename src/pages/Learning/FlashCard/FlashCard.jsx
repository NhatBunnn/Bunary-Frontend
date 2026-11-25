import { useEffect, useState, useCallback } from "react";
import styles from "./FlashCard.module.css";
import classNames from "classnames/bind";
import useFlashCard from "./useFlashCard";
import Loading from "@components/Loading/Loading";
import FinishScreen from "../components/FinishScreen/FinishScreen";
import { useNavigate, useParams } from "react-router-dom";
import { Image } from "@assets/images";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Volume2,
  Sparkles,
  Clock,
  Layers,
  AlertCircle,
  HelpCircle,
  ThumbsUp,
  Brain,
  BookOpen,
  Shuffle,
} from "lucide-react";

const c = classNames.bind(styles);

function FlashCard() {
  const { id } = useParams();
  const {
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
  } = useFlashCard();

  const [isFlip, setIsFlip] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [studyResult, setStudyResult] = useState(null);
  const [isGrading, setIsGrading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setProgress({ studyMode: "FLASHCARD" });
  }, [setProgress]);

  const handleSpeak = (e, text) => {
    e?.stopPropagation();
    if (!text || typeof window === "undefined" || !window.speechSynthesis)
      return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = useCallback(() => {
    setIsFlip((prev) => !prev);
  }, []);

  const handleSlideNext = useCallback(async () => {
    if (currentCard + 1 >= words.length) {
      const result = await handleRecordStudy();
      setStudyResult(result);
      setCurrentCard(words.length);
    } else {
      setCurrentCard((prev) => prev + 1);
      setIsFlip(false);
    }
  }, [currentCard, words.length, handleRecordStudy]);

  const handleSlidePrev = useCallback(() => {
    setCurrentCard((prev) => (prev === 0 ? 0 : prev - 1));
    setIsFlip(false);
  }, []);

  const handleSelectGrade = useCallback(
    async (grade) => {
      const activeWord = words[currentCard];
      if (!activeWord || isGrading) return;

      setIsGrading(true);
      await handleGradeWord(activeWord.id, grade);
      setIsGrading(false);
      handleSlideNext();
    },
    [words, currentCard, isGrading, handleGradeWord, handleSlideNext]
  );

  // Phím tắt
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (studyMode === "FREE") {
        if (e.code === "ArrowRight") {
          e.preventDefault();
          handleSlideNext();
        } else if (e.code === "ArrowLeft") {
          e.preventDefault();
          handleSlidePrev();
        }
      } else if (studyMode === "SM2") {
        if (e.key === "1") handleSelectGrade(1);
        else if (e.key === "2") handleSelectGrade(3);
        else if (e.key === "3") handleSelectGrade(4);
        else if (e.key === "4") handleSelectGrade(5);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    studyMode,
    handleFlip,
    handleSlideNext,
    handleSlidePrev,
    handleSelectGrade,
  ]);

  if (loading) return <Loading />;

  if (!words || words.length === 0) {
    return (
      <div className={c("emptyContainer")}>
        <div className={c("emptyCard")}>
          <Layers size={48} className={c("emptyIcon")} />
          <h2>Không có từ vựng nào để học</h2>
          <p>
            {filterMode === "DUE"
              ? "Tuyệt vời! Bạn không còn từ nào đến hạn ôn tập hôm nay."
              : "Bộ từ vựng này hiện chưa có từ nào."}
          </p>
          <div className={c("emptyActions")}>
            {filterMode === "DUE" && (
              <button
                className={c("btnPrimary")}
                onClick={() => setFilterMode("ALL")}
              >
                Học tất cả các từ
              </button>
            )}
            <button
              className={c("btnOutline")}
              onClick={() => navigate(`/wordset/${id}`)}
            >
              Về trang bộ từ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = words[currentCard] || words[0];
  const progressPercentage = ((currentCard + 1) / words.length) * 100;

  const getMemoryBadge = (status) => {
    switch (status) {
      case "MASTERED":
        return { label: "Đã thành thạo", className: "badgeMastered" };
      case "REVIEW":
        return { label: "Cần ôn tập", className: "badgeReview" };
      case "LEARNING":
        return { label: "Đang học", className: "badgeLearning" };
      default:
        return { label: "Từ mới", className: "badgeNew" };
    }
  };

  const badgeInfo = getMemoryBadge(currentWord?.memoryStatus);
  const hasFrontImage = Boolean(settings.front.image && currentWord?.thumbnail);
  const hasBackImage = Boolean(settings.back.image && currentWord?.thumbnail);

  return (
    <div className={c("flashCard")}>
      {currentCard >= words.length ? (
        <FinishScreen
          onRestart={() => {
            setCurrentCard(0);
            setIsFlip(false);
            setStudyResult(null);
          }}
          onGoHome={() => navigate(`/wordset/${id}`)}
          stats={studyResult}
          stageTitle="Trạm 1: Khởi động Flashcard"
          nextStageLabel="Làm trắc nghiệm Trạm 2"
          onNextStage={() => navigate(`/learning/${id}/multiple-choice`)}
        />
      ) : (
        <>
          {/* Thanh chọn Chế độ & Tiến độ */}
          <div className={c("topControls")}>
            <div className={c("studyModeSwitch")}>
              <button
                className={c("switchBtn", { active: studyMode === "FREE" })}
                onClick={() => {
                  setStudyMode("FREE");
                  setIsFlip(false);
                }}
              >
                <BookOpen size={15} />
                <span>Lật thẻ tự do</span>
              </button>
              <button
                className={c("switchBtn", { active: studyMode === "SM2" })}
                onClick={() => {
                  setStudyMode("SM2");
                  setIsFlip(false);
                }}
              >
                <Brain size={15} />
                <span>Lặp lại ngắt quãng SM-2</span>
              </button>
            </div>

            <div className={c("rightControls")}>
              {studyMode === "SM2" && dueWords.length > 0 && (
                <div className={c("filterGroup")}>
                  <button
                    className={c("filterChip", {
                      active: filterMode === "ALL",
                    })}
                    onClick={() => {
                      setFilterMode("ALL");
                      setCurrentCard(0);
                      setIsFlip(false);
                    }}
                  >
                    Tất cả ({allWords.length})
                  </button>
                  <button
                    className={c("filterChip", "dueChip", {
                      active: filterMode === "DUE",
                    })}
                    onClick={() => {
                      setFilterMode("DUE");
                      setCurrentCard(0);
                      setIsFlip(false);
                    }}
                  >
                    <Clock size={13} />
                    Cần ôn ({dueWords.length})
                  </button>
                </div>
              )}

              <button
                className={c("shuffleBtn", { active: isShuffled })}
                onClick={() => {
                  toggleShuffle();
                  setCurrentCard(0);
                  setIsFlip(false);
                }}
                title={
                  isShuffled
                    ? "Đang xáo trộn thẻ (nhấp để về thứ tự gốc)"
                    : "Xáo trộn ngẫu nhiên thứ tự thẻ"
                }
              >
                <Shuffle size={15} />
                <span>Xáo trộn</span>
              </button>

              <div className={c("cardCounter")}>
                {currentCard + 1} / {words.length}
              </div>
            </div>
          </div>

          {/* Thanh tiến trình */}
          <div className={c("progressContainer")}>
            <div
              className={c("progressBar")}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Thẻ Flashcard 3D */}
          <div className={c("content")}>
            <div
              className={c("card", isFlip ? "flipped" : "")}
              onClick={handleFlip}
            >
              {/* Mặt trước */}
              <div className={c("side", "front")}>
                <div className={c("cardTopBar")}>
                  <span className={c("memoryBadge", badgeInfo.className)}>
                    {badgeInfo.label}
                  </span>
                  <div className={c("topRightActions")}>
                    <span className={c("sideLabel")}>Mặt trước</span>
                    <button
                      className={c("audioBtn")}
                      onClick={(e) => handleSpeak(e, currentWord?.term)}
                      title="Nghe phát âm"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                </div>

                <div
                  className={c("cardBody", { hasImage: hasFrontImage })}
                >
                  {hasFrontImage && (
                    <div className={c("imageColumn")}>
                      <div className={c("imageWrapper")}>
                        <Image src={currentWord?.thumbnail} alt="" />
                      </div>
                    </div>
                  )}

                  <div className={c("textColumn")}>
                    {settings.front.partOfSpeech &&
                      currentWord?.partOfSpeech && (
                        <span className={c("partOfSpeech")}>
                          {currentWord.partOfSpeech}
                        </span>
                      )}

                    {settings.front.term && (
                      <h2 className={c("term")}>{currentWord?.term}</h2>
                    )}

                    {settings.front.ipa && currentWord?.ipa && (
                      <span className={c("ipa")}>/{currentWord.ipa}/</span>
                    )}

                    {settings.front.meaning && currentWord?.meaning && (
                      <p className={c("meaning")}>{currentWord.meaning}</p>
                    )}
                  </div>
                </div>

                <div className={c("flipHint")}>
                  <RotateCw size={14} />
                  <span>Nhấp vào thẻ hoặc ấn Space để xem nghĩa</span>
                </div>
              </div>

              {/* Mặt sau */}
              <div className={c("side", "back")}>
                <div className={c("cardTopBar")}>
                  <span className={c("memoryBadge", badgeInfo.className)}>
                    {badgeInfo.label}
                  </span>
                  <div className={c("topRightActions")}>
                    <span className={c("sideLabel")}>Đáp án</span>
                    <button
                      className={c("audioBtn")}
                      onClick={(e) => handleSpeak(e, currentWord?.term)}
                      title="Nghe phát âm"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                </div>

                <div
                  className={c("cardBody", { hasImage: hasBackImage })}
                >
                  {hasBackImage && (
                    <div className={c("imageColumn")}>
                      <div className={c("imageWrapper")}>
                        <Image src={currentWord?.thumbnail} alt="" />
                      </div>
                    </div>
                  )}

                  <div className={c("textColumn")}>
                    {currentWord?.partOfSpeech && (
                      <span className={c("partOfSpeech")}>
                        {currentWord.partOfSpeech}
                      </span>
                    )}

                    <h2 className={c("termBack")}>{currentWord?.term}</h2>

                    {currentWord?.ipa && (
                      <span className={c("ipa")}>/{currentWord.ipa}/</span>
                    )}

                    <div className={c("meaningHighlight")}>
                      <p className={c("meaningText")}>
                        {currentWord?.meaning}
                      </p>
                    </div>

                    {currentWord?.example && (
                      <p className={c("exampleSentence")}>
                        <em>"{currentWord.example}"</em>
                      </p>
                    )}
                  </div>
                </div>

                <div className={c("flipHint")}>
                  <RotateCw size={14} />
                  <span>Nhấp vào thẻ để lật lại mặt trước</span>
                </div>
              </div>
            </div>
          </div>

          {/* Điều khiển theo từng chế độ */}
          {studyMode === "SM2" ? (
            /* Chế độ SM-2: Luôn hiển thị 4 nút đánh giá trí nhớ, không có Trước/Sau */
            <div className={c("sm2Container")}>
              <p className={c("sm2Title")}>
                Đánh giá mức độ ghi nhớ của bạn để hệ thống SM-2 xếp lịch ôn tập (Phím tắt 1 - 4)
              </p>
              <div className={c("sm2Buttons")}>
                <button
                  className={c("sm2Btn", "btnAgain")}
                  onClick={() => handleSelectGrade(1)}
                  disabled={isGrading}
                >
                  <AlertCircle size={19} />
                  <div className={c("sm2BtnText")}>
                    <span className={c("sm2BtnLabel")}>Quên</span>
                    <span className={c("sm2BtnSub")}>Ôn lại ngay [1]</span>
                  </div>
                </button>

                <button
                  className={c("sm2Btn", "btnHard")}
                  onClick={() => handleSelectGrade(3)}
                  disabled={isGrading}
                >
                  <HelpCircle size={19} />
                  <div className={c("sm2BtnText")}>
                    <span className={c("sm2BtnLabel")}>Khó</span>
                    <span className={c("sm2BtnSub")}>Nhớ mang máng [2]</span>
                  </div>
                </button>

                <button
                  className={c("sm2Btn", "btnGood")}
                  onClick={() => handleSelectGrade(4)}
                  disabled={isGrading}
                >
                  <ThumbsUp size={19} />
                  <div className={c("sm2BtnText")}>
                    <span className={c("sm2BtnLabel")}>Nhớ tốt</span>
                    <span className={c("sm2BtnSub")}>Chuẩn SM-2 [3]</span>
                  </div>
                </button>

                <button
                  className={c("sm2Btn", "btnEasy")}
                  onClick={() => handleSelectGrade(5)}
                  disabled={isGrading}
                >
                  <Sparkles size={19} />
                  <div className={c("sm2BtnText")}>
                    <span className={c("sm2BtnLabel")}>Rất dễ</span>
                    <span className={c("sm2BtnSub")}>Giãn cách xa [4]</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Chế độ Lật thẻ tự do: Trước / Lật / Sau */
            <div className={c("actions")}>
              <button
                className={c("navBtn")}
                onClick={handleSlidePrev}
                disabled={currentCard === 0}
                title="Thẻ trước [Phím ←]"
              >
                <ChevronLeft size={20} />
                <span>Trước</span>
              </button>

              <button
                className={c("flipCenterBtn")}
                onClick={handleFlip}
                title="Lật thẻ [Phím Space]"
              >
                <RotateCw size={18} />
                <span>{isFlip ? "Lật mặt trước" : "Lật xem nghĩa"}</span>
              </button>

              <button
                className={c("navBtn", {
                  finishNav: currentCard + 1 >= words.length,
                })}
                onClick={handleSlideNext}
                title="Thẻ tiếp theo [Phím →]"
              >
                <span>
                  {currentCard + 1 >= words.length ? "Hoàn thành" : "Sau"}
                </span>
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FlashCard;
