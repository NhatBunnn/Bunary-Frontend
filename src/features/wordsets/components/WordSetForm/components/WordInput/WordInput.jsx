import classNames from "classnames/bind";
import styles from "./WordInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripLines,
  faImage,
  faTrash,
  faLink,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Image } from "@assets/images";
import Button from "@components/Button/Button";

const c = classNames.bind(styles);

export default function WordInput({ word, onChange, onRemove, index }) {
  const inputRefs = useRef([]);
  const [charCount, setCharCount] = useState({
    term: 0,
    ipa: 0,
    partOfSpeech: 0,
    meaning: 0,
  });
  const [thumbBox, setThumbBox] = useState(false);
  const [activeTab, setActiveTab] = useState("url");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(""); // Chỉ 1 ảnh
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  // Reset modal
  useEffect(() => {
    if (thumbBox) {
      setSearchQuery(word?.term || "");
      setActiveTab("url");
      setSearchResult("");
      setErrors("");
    }
  }, [thumbBox, word?.term]);

  // Kiểm tra base64
  useEffect(() => {
    setErrors("");
    if (
      typeof word?.thumbnail === "string" &&
      word.thumbnail.startsWith("data:image/") &&
      word.thumbnail.includes(";base64,")
    ) {
      setErrors("Không cho phép base64. Vui lòng dùng URL ảnh hợp lệ.");
    }
  }, [word?.thumbnail]);

  const toggleThumbBox = () => setThumbBox((prev) => !prev);

  const autoGrowInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleCharCount = (value, type) => {
    setCharCount((prev) => ({ ...prev, [type]: value.length }));
  };

  const limitText = (v) => (v.length > 500 ? v.slice(0, 500) : v);

  // Tìm 1 ảnh CỐ ĐỊNH từ loremflickr.com/cache
  const searchLoremFlickr = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchResult("");
    setErrors("");

    const keyword = encodeURIComponent(searchQuery.trim());
    const width = 320;
    const height = 240;

    // Dùng /cache + ?lock=1 → ảnh CỐ ĐỊNH MÃI MÃI
    const url = `https://loremflickr.com/cache/${width}/${height}/${keyword}?lock=1`;

    try {
      const img = new window.Image();
      img.src = url;

      await new Promise((resolve, reject) => {
        img.onload = () => {
          setSearchResult(url);
          resolve();
        };
        img.onerror = () => reject(new Error("Load failed"));
        setTimeout(reject, 5000); // timeout 5s
      });
    } catch (err) {
      setErrors("Không tải được ảnh. Thử từ khóa khác.");
    } finally {
      setLoading(false);
    }
  };

  const selectImage = () => {
    if (!searchResult) return;
    // Lưu URL sạch (không ?lock)
    const cleanUrl = searchResult.split("?")[0];
    onChange(index, "thumbnail", cleanUrl);
    setThumbBox(false);
  };

  const handleSearchTab = () => {
    setActiveTab("search");
    if (searchQuery.trim() && !searchResult) {
      searchLoremFlickr();
    }
  };

  return (
    <div className={c("wordInput")}>
      {/* Head */}
      <div className={c("wordCardTitle")}>
        <div className={c("index")}>{index + 1}</div>
        <div className={c("actions")}>
          <span className={c("icon")}>
            <FontAwesomeIcon icon={faGripLines} />
          </span>
          <span className={c("icon", "trash")} onClick={() => onRemove(word)}>
            <FontAwesomeIcon icon={faTrash} />
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={c("wordCardInput")}>
        {[
          { key: "term", label: "Thuật ngữ" },
          { key: "ipa", label: "IPA" },
          { key: "partOfSpeech", label: "Loại từ" },
          { key: "meaning", label: "Nghĩa" },
        ].map(({ key, label }, i) => (
          <div key={key} className={c("input")}>
            <textarea
              className={c("text-input")}
              value={word?.[key] || ""}
              onChange={(e) => {
                const value = limitText(e.target.value);
                handleCharCount(value, key);
                onChange(index, key, value);
                autoGrowInput(e);
              }}
              ref={(el) => (inputRefs.current[i] = el)}
              placeholder={label}
              rows={1}
            />
            <div className={c("sub-input")}>
              <span>{label}</span>
              {charCount[key] > 0 && <span>{charCount[key]}/500</span>}
            </div>
          </div>
        ))}

        {/* Thumbnail */}
        <div className={c("image")} onClick={toggleThumbBox}>
          {word?.thumbnail ? (
            <Image src={word.thumbnail} className={c("thumb-img")} />
          ) : (
            <FontAwesomeIcon
              icon={faImage}
              size="2x"
              className={c("placeholder")}
            />
          )}
        </div>
      </div>

      {/* Image Modal */}
      {thumbBox && (
        <div className={c("image-modal-backdrop")} onClick={toggleThumbBox}>
          <div
            className={c("image-modal")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={c("modal-header")}>
              <h5>Chọn ảnh minh họa</h5>
            </div>

            {/* Tabs */}
            <div className={c("tabs")}>
              <button
                className={c("tab", { active: activeTab === "url" })}
                onClick={() => setActiveTab("url")}
              >
                <FontAwesomeIcon icon={faLink} /> URL
              </button>
              <button
                className={c("tab", { active: activeTab === "search" })}
                onClick={handleSearchTab}
              >
                <FontAwesomeIcon icon={faSearch} /> Tìm ảnh
              </button>
            </div>

            <div className={c("modal-body")}>
              {/* Tab URL */}
              {activeTab === "url" && (
                <div>
                  <label className={c("label")}>Dán URL ảnh:</label>
                  <input
                    type="text"
                    className={c("url-input")}
                    value={word?.thumbnail || ""}
                    onChange={(e) =>
                      onChange(index, "thumbnail", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors && <p className={c("error")}>{errors}</p>}
                  {word?.thumbnail && !errors && (
                    <div className={c("preview")}>
                      <Image src={word.thumbnail} size="150px" />
                    </div>
                  )}
                </div>
              )}

              {/* Tab Tìm ảnh - 1 ảnh cố định */}
              {activeTab === "search" && (
                <div>
                  <div className={c("search-bar")}>
                    <input
                      type="text"
                      className={c("search-input")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && searchLoremFlickr()
                      }
                      placeholder="Từ khóa (ví dụ: dog, cat...)"
                    />
                    <Button
                      label={loading ? "..." : "Tìm"}
                      onClick={searchLoremFlickr}
                      disabled={loading}
                      size="sm"
                    />
                  </div>

                  {loading && <p className={c("loading")}>Đang tìm ảnh...</p>}

                  {errors && <p className={c("error")}>{errors}</p>}

                  {searchResult && (
                    <div className={c("image-single")}>
                      <img src={searchResult} alt="Kết quả" />
                      <Button
                        label="Chọn ảnh này"
                        onClick={selectImage}
                        size="sm"
                        className={c("select-btn")}
                      />
                    </div>
                  )}

                  {!searchResult && !loading && searchQuery && (
                    <p className={c("no-results")}>
                      Chưa có ảnh. Nhấn "Tìm" để lấy ảnh cho "
                      <strong>{searchQuery}</strong>"
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className={c("modal-footer")}>
              <Button label="Đóng" onClick={toggleThumbBox} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
