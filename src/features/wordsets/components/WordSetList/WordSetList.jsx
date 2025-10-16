import { bindClass } from "@utils/classnames";
import styles from "./WordSetList.module.css";
import useWordSetList from "@features/wordsets/hooks/useWordSetList";
import WordSetSlider from "../WordSetSlider/WordSetSlider";

const c = bindClass(styles);

function WordSetList() {
  const { wordSetList, loading } = useWordSetList();

  return (
    <div className={c("wordSetList")}>
      <WordSetSlider wordSets={wordSetList} />
    </div>
  );
}

export default WordSetList;
