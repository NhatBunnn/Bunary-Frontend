import { useState, useEffect } from "react";
import styles from "./WordSetSlider.module.css";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faA,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import WordSet from "../WordSet/WordSet";
import Button from "@components/Button/Button";

const c = classNames.bind(styles);

function WordSetSlider({ className, wordSets }) {
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [anim, setAnim] = useState(""); // fade-left / fade-right / fade-in

  // Responsive
  useEffect(() => {
    const updateItems = () => {
      const w = window.innerWidth;
      if (w <= 768) setItemsPerPage(1);
      else if (w <= 1200) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const totalPages = Math.ceil(wordSets.length / itemsPerPage);

  const nextPage = () => {
    setAnim("fade-left");
    setTimeout(() => {
      setCurrentPage((p) => (p + 1) % totalPages);
      setAnim("fade-in");
    }, 250);
  };

  const prevPage = () => {
    setAnim("fade-right");
    setTimeout(() => {
      setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
      setAnim("fade-in");
    }, 250);
  };

  const start = currentPage * itemsPerPage;
  const visible = wordSets.slice(start, start + itemsPerPage);

  return (
    <div className={c("wordSetSlider", className)}>
      {/* Buttons */}
      <Button
        className={c("btn-leftArrow")}
        onClick={prevPage}
        variant="outline"
        icon={<FontAwesomeIcon icon={faAngleLeft} size="lg" />}
      />

      <Button
        className={c("btn-rightArrow")}
        onClick={nextPage}
        variant="outline"
        icon={<FontAwesomeIcon icon={faAngleRight} size="lg" />}
      />

      {/* Slider Items */}
      <div className={c("fadeWrapper", anim)}>
        {visible.map((d, i) => (
          <div className={c("item")} key={i}>
            <WordSet size="large" author={d?.author} wordSet={d} />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className={c("dots")}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            className={c("dot", { active: i === currentPage })}
            onClick={() => {
              if (i === currentPage) return; // không click dot hiện tại

              // Xác định hướng animation
              if (i > currentPage) setAnim("fade-left");
              else setAnim("fade-right");

              setTimeout(() => {
                setCurrentPage(i);
                setAnim("fade-in");
              }, 250);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default WordSetSlider;
