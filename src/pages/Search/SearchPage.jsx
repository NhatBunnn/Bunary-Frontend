import TitleSection from "@components/TitleSection";
import styles from "./SearchPage.module.css";
import { bindClass } from "@utils/classnames";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import useSearchPage from "./useSearchPage";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { WordSet } from "@features/wordsets/components";
import { Search } from "lucide-react";

const c = bindClass(styles);

const searchTabs = [
  { id: "wordsets", label: "Bộ từ vựng" },
  { id: "collections", label: "Bộ sưu tập" },
  { id: "users", label: "Người dùng" },
  { id: "posts", label: "Bài viết" },
];

function SearchPage() {
  const { fetchWordSets, wordSetList } = useSearchPage();
  const [activeTab, setActiveTab] = useState("wordsets");

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || searchParams.get("q") || "";

  useEffect(() => {
    fetchWordSets(searchParams);
  }, [searchParams]);

  return (
    <div className={c("searchPage")}>
      {/* Title */}
      <TitleSection
        icon={faSearch}
        title={query ? `Kết quả tìm kiếm cho "${query}"` : "Kết quả tìm kiếm"}
        onTop={true}
      />
      {/* Tabs */}
      <div className={c("tab")}>
        {searchTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={c("tabBtn", { active: activeTab === tab.id })}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className={c("content", "mt-3")}>
        {activeTab === "wordsets" ? (
          wordSetList.length > 0 ? (
            wordSetList.map((wordSet) => (
              <div className="mb-3" key={wordSet.id}>
                <WordSet size="large" wordSet={wordSet} />
              </div>
            ))
          ) : (
            <div className={c("emptyState")}>
              <Search size={40} className={c("emptyIcon")} />
              <p className={c("emptyText")}>Không tìm thấy bộ từ vựng nào phù hợp</p>
              <span className={c("emptySubtext")}>Hãy thử tìm kiếm với từ khóa khác</span>
            </div>
          )
        ) : (
          <div className={c("emptyState")}>
            <Search size={40} className={c("emptyIcon")} />
            <p className={c("emptyText")}>Đang cập nhật tìm kiếm theo mục này</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
