import TitleSection from "@components/TitleSection";
import styles from "./PopularWordSet.module.css";
import { bindClass } from "@utils/classnames";
import { useWordSetList } from "@features/wordsets/hooks";
import WordSet from "@components/WordSet";
import { FilterBar } from "@components/index";

const c = bindClass(styles);

function PopularWordSet() {
  const { wordSetList, loading } = useWordSetList();

  return (
    <div className={c("popularWordSet")}>
      <TitleSection title="Bộ từ vựng vựng phổ biến" />
      <FilterBar />
      <div className="row">
        {wordSetList?.map((d, i) => {
          return (
            <div className="col-4 mb-3">
              <WordSet wordSet={d} index={i} size="large" author={d.author} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PopularWordSet;
