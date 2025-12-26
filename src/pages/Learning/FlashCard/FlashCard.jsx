import { useEffect, useState } from "react";
import styles from "./FlashCard.module.css";
import classNames from "classnames/bind";
import useFlashCard from "./useFlashCard";
import Loading from "@components/Loading/Loading";
import FinishScreen from "../components/FinishScreen/FinishScreen";
import { useNavigate } from "react-router-dom";
import { getThumbnailUrl } from "@utils/getThumbnailUrl";
import { ChevronLeft, ChevronRight, RotateCw, Info } from "lucide-react";

const c = classNames.bind(styles);

function FlashCard() {
  const { words, loading, settings, handleRecordStudy, setProgress } =
    useFlashCard();
  const [isFlip, setIsFlip] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [studyResult, setStudyResult] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setProgress({ studyMode: "FLASHCARD" });
  }, []);

  if (loading) return <Loading />;

  const handleSlideNext = async () => {
    if (currentCard + 1 === words.length) {
      const result = await handleRecordStudy();
      setStudyResult(result);
    }

    setCurrentCard((prev) => prev + 1);
    setIsFlip(false);
  };

  const handleSlidePrev = () => {
    setCurrentCard((prev) => (prev === 0 ? words.length - 1 : prev - 1));
    setIsFlip(false);
  };

  const handleFlip = () => {
    setIsFlip((prev) => !prev);
  };

  const progressPercentage = ((currentCard + 1) / words.length) * 100;

  return (
    <div className={c("flashCard")}>
      {currentCard === words.length ? (
        <FinishScreen
          onRestart={() => {
            setCurrentCard(0);
            setStudyResult(null);
          }}
          onGoHome={() => navigate("/")}
          stats={studyResult}
        />
      ) : (
        <>
          <div className={c("header")}>
            <div className={c("cardCounter")}>
              {currentCard + 1} / {words.length}
            </div>
            <div className={c("progressContainer")}>
              <div
                className={c("progressBar")}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className={c("content")}>
            <div
              className={c("card", isFlip ? "flipped" : "")}
              onClick={handleFlip}
            >
              {/* Front Side */}
              <div className={c("side", "front")}>
                {settings.front.image && words[currentCard]?.thumbnail && (
                  <div className={c("imageWrapper")}>
                    <img
                      src={getThumbnailUrl(words[currentCard]?.thumbnail)}
                      alt=""
                    />
                  </div>
                )}
                {settings.front.partOfSpeech &&
                  words[currentCard]?.partOfSpeech && (
                    <span className={c("partOfSpeech")}>
                      {words[currentCard].partOfSpeech}
                    </span>
                  )}
                {settings.front.term && (
                  <h2 className={c("term")}>{words[currentCard]?.term}</h2>
                )}
                {settings.front.ipa && words[currentCard]?.ipa && (
                  <span className={c("ipa")}>/{words[currentCard].ipa}/</span>
                )}
                {settings.front.meaning && (
                  <p className={c("meaning")}>{words[currentCard]?.meaning}</p>
                )}
                <div className={c("flipHint")}>
                  <RotateCw size={14} />
                  <span>Click to flip</span>
                </div>
              </div>

              {/* Back Side */}
              <div className={c("side", "back")}>
                {settings.back.image && words[currentCard]?.thumbnail && (
                  <div className={c("imageWrapper")}>
                    <img
                      src={getThumbnailUrl(words[currentCard]?.thumbnail)}
                      alt=""
                    />
                  </div>
                )}
                {settings.back.partOfSpeech &&
                  words[currentCard]?.partOfSpeech && (
                    <span className={c("partOfSpeech")}>
                      {words[currentCard].partOfSpeech}
                    </span>
                  )}
                {settings.back.term && (
                  <h2 className={c("term")}>{words[currentCard]?.term}</h2>
                )}
                {settings.back.ipa && words[currentCard]?.ipa && (
                  <span className={c("ipa")}>/{words[currentCard].ipa}/</span>
                )}
                {settings.back.meaning && (
                  <p className={c("meaning")}>{words[currentCard]?.meaning}</p>
                )}
                <div className={c("flipHint")}>
                  <RotateCw size={14} />
                  <span>Click to flip</span>
                </div>
              </div>
            </div>
          </div>

          <div className={c("actions")}>
            <button
              className={c("navBtn")}
              onClick={handleSlidePrev}
              disabled={currentCard === 0}
              title="Previous"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              className={c("navBtn")}
              onClick={handleSlideNext}
              title="Next"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default FlashCard;
