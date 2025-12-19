import TitleSection from "@components/TitleSection";
import styles from "./SearchPage.module.css";
import { bindClass } from "@utils/classnames";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import useSearchPage from "./useSearchPage";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { WordSet } from "@features/wordsets/components";

const c = bindClass(styles);

function SearchPage() {
  const { fetchWordSets, wordSetList, pagination } = useSearchPage();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchWordSets(searchParams);
  }, [searchParams]);

  return (
    <div className={c("searchPage")}>
      {/* Title */}
      <TitleSection icon={faSearch} title="Kết quả tìm kiếm" onTop={true} />
      {/* Tabs */}
      <div className={c("tab")}>
        <button>Bộ từ vựng</button>
        <button>Bộ Sưu tập</button>
        <button>Người dùng</button>
        <button>Bài viết</button>
      </div>
      {/* Content */}
      <div className={c("content", "mt-3")}>
        {wordSetList.length > 0 ? (
          wordSetList.map((wordSet) => (
            <div className="mb-3" key={wordSet.id}>
              <WordSet size="large" wordSet={wordSet} />
            </div>
          ))
        ) : (
          <>Không có kết quả</>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
