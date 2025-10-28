import { bindClass } from "@utils/classnames";
import styles from "./WordSetList.module.css";
import useWordSetList from "@features/wordsets/hooks/useWordSetList";
import WordSetSlider from "../WordSetSlider/WordSetSlider";
import { useEffect } from "react";

const c = bindClass(styles);

/**
 * WordSetList component
 * @param {"popularityScore,desc" || "createdAt,desc"} initialSort
 */
function WordSetList({ initialSort = "popularityScore,desc" }) {
  const { wordSetList } = useWordSetList(initialSort);

  return (
    <div className={c("wordSetList")}>
      <WordSetSlider wordSets={wordSetList} />
    </div>
  );
}

export default WordSetList;
