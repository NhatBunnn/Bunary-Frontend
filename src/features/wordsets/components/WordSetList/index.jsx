import { createContext, useState } from "react";
import WordSet from "../../../../components/WordSet";
import styles from "./WordSetListWrapper.module.css";
import classNames from "classnames/bind";
import { useWordSetListProvider } from "../../../../context/WordSetListProvider";
import Loading from "../../../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const c = classNames.bind(styles);

export const wordSetValueContext = createContext();

function WordSetList({ className }) {
  const { wordSets } = useWordSetListProvider();
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!wordSets) return <Loading />;

  const handleSlide = (direction) => {
    const total = Math.ceil(wordSets.length / 3);
    if (direction === "prev") {
      currentSlide !== total && setCurrentSlide((prev) => prev - 1);
    } else {
      currentSlide + 1 >= total
        ? setCurrentSlide(0)
        : setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <div className={c("wordSetListWrapper", "d-flex", className)}>
      <div className={c("slider-container")}>
        <div className={c("btn-leftArrow")} onClick={() => handleSlide("prev")}>
          <FontAwesomeIcon icon={faAngleLeft} size="lg" />
        </div>
        <div
          className={c("btn-rightArrow")}
          onClick={() => handleSlide("next")}
        >
          <FontAwesomeIcon icon={faAngleRight} size="lg" />
        </div>
        <div
          className={c("slider-track")}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: "transform 0.5s ease",
          }}
        >
          {wordSets?.map((d, i) => {
            return (
              <div className={c("slider")}>
                <WordSet size="large" author={d.author} wordSet={d} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WordSetList;
