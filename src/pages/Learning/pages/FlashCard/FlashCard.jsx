import { useState } from "react";
import Button from "@components/Button/Button";
import styles from "./FlashCard.module.css";
import classNames from "classnames/bind";
import useFlashCard from "./useFlashCard";
import Loading from "@components/Loading/Loading";
import FinishScreen from "../FinishScreen/FinishScreen";
import { useNavigate } from "react-router-dom";
import { getThumbnailUrl } from "@utils/getThumbnailUrl";

const c = classNames.bind(styles);

function FlashCard() {
  const { words, loading, settings, handleRecordStudy } = useFlashCard();
  const [isFlip, setIsFlip] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);

  const navigate = useNavigate();

  if (loading) return <Loading />;

  const flashCardFields = [
    { key: "term" },
    { key: "ipa" },
    { key: "meaning" },
    { key: "partOfSpeech" },
  ];

  const flashCardSides = [{ side: "front" }, { side: "back" }];

  const handleSlideNext = () => {
    console.log("currentCard ", currentCard);
    console.log("words.length", words.length);

    if (currentCard + 1 === words.length) {
      handleRecordStudy();
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

  return (
    <div className={c("flashCard")}>
      {currentCard === words.length ? (
        <FinishScreen
          onRestart={() => setCurrentCard(0)}
          onGoHome={() => navigate("/")}
        />
      ) : (
        <>
          <div className={c("card-counter")}>
            {currentCard + 1}/{words.length}
          </div>

          <div className={c("content")}>
            <div
              className={c(
                "card",
                "d-flex",
                "justify-content-center",
                "align-items-center",
                isFlip ? "flipped" : ""
              )}
              onClick={handleFlip}
            >
              {flashCardSides.map((flashCardSide, i) => (
                <div key={i} className={c(flashCardSide.side)}>
                  {settings[flashCardSide.side].image === true && (
                    <div className={c("image")}>
                      <img
                        src={getThumbnailUrl(words[currentCard]?.thumbnail)}
                        alt=""
                      />
                    </div>
                  )}
                  {flashCardFields.map((field, j) =>
                    settings?.[flashCardSide.side]?.[field.key] ? (
                      <div key={j}>{words?.[currentCard]?.[field.key]}</div>
                    ) : null
                  )}
                </div>
              ))}
            </div>

            <div className={c("action")}>
              <div className={c("control-btn")}>
                <Button
                  label="Trước"
                  className={c("ms-2")}
                  onClick={handleSlidePrev}
                />
                <Button
                  label="Sau"
                  className={c("me-2")}
                  onClick={handleSlideNext}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FlashCard;
