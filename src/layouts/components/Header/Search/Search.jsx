import { useState, useRef, useEffect } from "react";
import styles from "./Search.module.css";
import { bindClass } from "@utils/classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSearch,
  faBookOpen,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import useSearch from "./useSearch";
import { Image } from "@assets/images";
import { useNavigate } from "react-router-dom";

const c = bindClass(styles);

export default function Search() {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  const { keyword, setKeyword, wordsets, users, totalResult } = useSearch();

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        resultRef.current &&
        !resultRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSearch = (e) => {
    if (e.key == "Enter") {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
      setIsFocused(false);
    }
  };

  const hasAnyResult = (wordsets?.length || 0) + (users?.length || 0) > 0;

  return (
    <div className={c("search")}>
      <div className={c("wrapper")}>
        <div className={c("icon")}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <input
          ref={inputRef}
          type="text"
          className={c("input")}
          placeholder="Tìm kiếm bài học, từ vựng, người học..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={onSearch}
        />
      </div>

      <div
        ref={resultRef}
        className={c("result", { "result--visible": isFocused })}
      >
        <div className={c("header")}>
          <FontAwesomeIcon icon={faSearch} />
          <span>
            Kết quả cho <strong>"{keyword}"</strong>
          </span>
        </div>

        <div className={c("result-body")}>
          {wordsets?.length > 0 && (
            <Section
              title="Bộ từ vựng"
              icon={faBookOpen}
              count={totalResult?.totalWordSet}
            >
              {wordsets.map((item) => (
                <WordsetItem key={item.id} {...item} />
              ))}
            </Section>
          )}

          {users?.length > 0 && (
            <Section
              title="Người học"
              icon={faUser}
              count={totalResult?.totalUser}
            >
              {users.map((user) => (
                <UserItem key={user.id} {...user} />
              ))}
            </Section>
          )}

          {!hasAnyResult && keyword && (
            <div className={c("empty")}>
              <FontAwesomeIcon icon={faSearch} />
              <p>Không tìm thấy kết quả nào cho “{keyword}”</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Section chung
function Section({ title, icon, count, children }) {
  return (
    <div className={c("section")}>
      <div className={c("section-title")}>
        <FontAwesomeIcon icon={icon} />
        <span>{title}</span>
        {count !== undefined && <span className={c("count")}>{count}</span>}
      </div>
      <div className={c("result-list")}>{children}</div>
    </div>
  );
}

// Bộ từ vựng
function WordsetItem({ id, title, thumbnail }) {
  return (
    <div className={c("item")}>
      <div className={c("item-icon", "icon-wordset")}>
        {thumbnail ? (
          <Image src={thumbnail} />
        ) : (
          <FontAwesomeIcon icon={faBookOpen} />
        )}
      </div>
      <div className={c("item-content")}>
        <h4 className={c("item-title")}>{title}</h4>
      </div>
      <a
        href={`/wordset/${id}/${title
          .split(" ")
          .filter(Boolean)
          .map((d) => d.toLowerCase())
          .join("-")}`}
        className={c("item-action")}
      >
        Học ngay
      </a>
    </div>
  );
}

// Người dùng
function UserItem({ fullName, avatar }) {
  return (
    <div className={c("item")}>
      <div className={c("item-avatar")}>
        <Image src={avatar} />
      </div>
      <div className={c("item-content")}>
        <h4 className={c("item-title")}>{fullName}</h4>
      </div>
    </div>
  );
}
