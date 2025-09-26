import styles from "./Search.module.css";
import { bindClass } from "@utils/classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSearch } from "@fortawesome/free-solid-svg-icons";
import SearchItem from "../SearchItem/SearchItem";

const c = bindClass(styles);

function Search() {
  return (
    <div className={c("search", "d-flex", "justify-content-center")}>
      <label className={c("warpper", "d-flex", "justify-content-center")}>
        <div
          className={c(
            "icon",
            "d-flex",
            "justify-content-center",
            "align-items-center"
          )}
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ fontSize: "18px" }}
          />
        </div>
        <input
          type="text"
          className={c("input")}
          placeholder="Tìm kiếm bài học ..."
        />
      </label>
      <div className={c("result", "px-4", "py-2", "d-none")}>
        <div className={c("header")}>
          <FontAwesomeIcon icon={faSearch} />
          <span>Kết quả tìm kiếm cho 'nhật'</span>
        </div>
        <div className={c("wordsets")}>
          <div className={c("title", "d-flex", "justify-content-between")}>
            <span>Bộ từ vựng</span>
            <span>Xem thêm</span>
          </div>
          <hr />
          <div className={c("result-list", "d-flex", "flex-column", "gap-3")}>
            <SearchItem />
            <SearchItem />
            <SearchItem />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
