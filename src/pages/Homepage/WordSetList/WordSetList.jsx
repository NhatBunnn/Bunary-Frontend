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
  const {
    wordSetList,
    pagination,
    queryParams,
    handleFetchWordSetList,
    updateSearchParams,
  } = useWordSetList("popularityScore,desc");

  return (
    <div className={c("wordSetList")}>
      <Tabs />
      <TitleSection title="Bộ từ vựng phổ biến" />
      <FilterBar
        className="mb-3"
        queryParams={queryParams}
        updateSearchParams={updateSearchParams}
        onSubmit={handleFetchWordSetList}
      />
      <div className="row">
        {wordSetList?.map((d, i) => (
          <div className="col-4 mb-3" key={d.id || i}>
            <WordSet wordSet={d} index={i} size="large" author={d.author} />
          </div>
        ))}
      </div>

      <div className={"pagination d-flex justify-content-center"}>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                onClick={() => {
                  updateSearchParams({ page: 1 });
                }}
              >
                Trang đầu
              </a>
            </li>
            {getPaginationPages(
              pagination.currentPage + 1,
              pagination.totalPages
            )?.map((page, i) => (
              <li className="page-item">
                {page === "..." ? (
                  <span className="page-link">...</span>
                ) : (
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => {
                      updateSearchParams({ page });
                    }}
                  >
                    {page}
                  </a>
                )}
              </li>
            ))}
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                onClick={() =>
                  updateSearchParams({ page: pagination.totalPages })
                }
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default WordSetList;
