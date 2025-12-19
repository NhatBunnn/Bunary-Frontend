import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TitleSection from "@components/TitleSection";
import styles from "./WordSetList.module.css";
import { bindClass } from "@utils/classnames";
import { useWordSetList } from "@features/wordsets/hooks";
import FilterBar from "./FilterBar/FilterBar";
import { WordSet } from "@features/wordsets/components";
import Tabs from "../components/Tabs/Tabs";
import { getPaginationPages } from "@utils/pagination";

const c = bindClass(styles);

function WordSetList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wordSetList, pagination, fetchWordSets } = useWordSetList();

  useEffect(() => {
    fetchWordSets(searchParams);
  }, [searchParams]);

  const updateSearchParams = (updates) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value == null) {
          delete params[key];
        } else {
          params[key] = value;
        }
      });

      return params;
    });
  };

  return (
    <div className={c("wordSetList")}>
      <Tabs />
      <TitleSection title="Bộ từ vựng phổ biến" />

      <FilterBar
        className="mb-3"
        queryParams={Object.fromEntries(searchParams)}
        updateSearchParams={updateSearchParams}
      />

      <div className="row">
        {wordSetList.map((d, i) => (
          <div className="col-4 mb-3" key={d.id || i}>
            <WordSet wordSet={d} index={i} size="large" author={d.author} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination d-flex justify-content-center">
        <ul className="pagination">
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => updateSearchParams({ page: 1 })}
            >
              Trang đầu
            </button>
          </li>

          {getPaginationPages(
            pagination.currentPage + 1,
            pagination.totalPages
          ).map((page, i) => (
            <li className="page-item" key={i}>
              {page === "..." ? (
                <span className="page-link">...</span>
              ) : (
                <button
                  className="page-link"
                  onClick={() => updateSearchParams({ page })}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          <li className="page-item">
            <button
              className="page-link"
              onClick={() =>
                updateSearchParams({ page: pagination.totalPages })
              }
            >
              Cuối
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default WordSetList;
