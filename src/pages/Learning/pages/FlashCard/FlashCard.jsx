import { useState } from "react";
import Button from "@components/Button";
import styles from "./FlashCard.module.css";
import classNames from "classnames/bind";
import useFlashCard from "./useFlashCard";
import Loading from "@components/Loading";

const c = classNames.bind(styles);

function FlashCard() {
  const { words, loading } = useFlashCard();
  const [isFlip, setIsFlip] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);

  if (loading) return <Loading />;

  const handleSlideNext = () => {
    setCurrentCard((prev) => (prev >= words.length - 1 ? 0 : prev + 1));
    setIsFlip(false);
  };

  const handleSlidePrev = () => {
    setCurrentCard((prev) => (prev === 0 ? words.length - 1 : prev - 1));
    setIsFlip(false);
  };

  const handleFlip = () => {
    isFlip ? setIsFlip(false) : setIsFlip(true);
  };

  return (
    <div className={c("flashCard")}>
      <div className={c("content")}>
        <div
          className={c(
            "card",
            "d-flex",
            "justify-content-center",
            "align-items-center",
            "cursor-pointer",
            isFlip ? "flipped" : ""
          )}
          onClick={handleFlip}
        >
          <div className={c("front")}>
            <div className={c("image")}>
              <img src={words[currentCard]?.thumbnail} alt="" />
            </div>
            <div>
              {words[currentCard]?.term} {words[currentCard]?.partOfSpeech}
            </div>
          </div>
          <div className={c("back")}>
            <div>{words[currentCard]?.ipa}</div>
            <div>{words[currentCard]?.meaning}</div>
          </div>
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
    </div>
  );
}

export default FlashCard;
