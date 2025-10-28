// PopularWordSet.jsx
import TitleSection from "@components/TitleSection";
import styles from "./PopularWordSet.module.css";
import { bindClass } from "@utils/classnames";
import { useWordSetList } from "@features/wordsets/hooks";
import FilterBar from "./FilterBar/FilterBar";
import { WordSet } from "@features/wordsets/components";

const c = bindClass(styles);

function PopularWordSet() {
  const { wordSetList, queryParams, setQueryParams, fetchWordSetList } =
    useWordSetList("popularityScore,desc");

  return (
    <div className={c("popularWordSet")}>
      <TitleSection title="Bộ từ vựng phổ biến" />
      <FilterBar
        className="mb-3"
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        onSubmit={fetchWordSetList} // submit trực tiếp
      />
      <div className="row">
        {wordSetList?.map((d, i) => (
          <div className="col-4 mb-3" key={d.id || i}>
            <WordSet wordSet={d} index={i} size="large" author={d.author} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularWordSet;
