import { createContext, useState, useEffect, useRef } from "react";
import styles from "./WordSetSlider.module.css";
import classNames from "classnames/bind";
import Loading from "@components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import WordSet from "../WordSet/WordSet";

const c = classNames.bind(styles);

export const wordSetValueContext = createContext();

function WordSetSlider({ className, wordSets }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      const width = window.innerWidth;
      if (width <= 768) setItemsPerSlide(1);
      else if (width <= 1200) setItemsPerSlide(2);
      else setItemsPerSlide(3);
    };
    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  if (!wordSets) return <Loading />;

  const totalSlides = Math.ceil(wordSets.length / itemsPerSlide);

  const handleSlide = (direction) => {
    if (direction === "prev") {
      setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    } else {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }
  };

  const getTranslateX = () => {
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    const gap = 15; // px gap
    const itemWidth =
      (containerWidth - gap * (itemsPerSlide - 1)) / itemsPerSlide;
    return currentSlide * (itemWidth + gap);
  };

  return (
    <div className={c("wordSetSlider", "d-flex", className)}>
      <div className={c("slider-container")} ref={containerRef}>
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
            transform: `translateX(-${getTranslateX()}px)`,
            transition: "transform 0.5s ease",
          }}
        >
          {wordSets.map((d, i) => (
            <div
              className={c("slider")}
              key={i}
              style={{
                flex: `0 0 calc(${100 / itemsPerSlide}% - ${
                  (15 * (itemsPerSlide - 1)) / itemsPerSlide
                }px)`,
              }}
            >
              <WordSet size="large" author={d?.author} wordSet={d} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WordSetSlider;
