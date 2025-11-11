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
import { Image, Images } from "@assets/images";
import Button from "@components/Button/Button";
import { useEffect, useState } from "react";
import useWordInput from "./useWordInput";
import { API_URL } from "@config/apiConfig";

const c = classNames.bind(styles);

export default function WordInput({ word, onChangeWord, onRemove, index }) {
  const [openDialog, setOpenDialog] = useState({
    thumbnail: false,
  });
  const [activeTab, setActiveTab] = useState("search"); // "url" or "search"

  const {
    searchResults,
    searchKeyword,
    fetchTermImages,
    setSearchKeyword,
    loading: searchKeywordLoading,
  } = useWordInput();

  const toggleDialog = (type) => {
    setOpenDialog((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  useEffect(() => {
    setSearchKeyword(word?.term);
  }, [word?.term]);

  return (
    <div className={c("wordInput")}>
      {/* Head */}
      <div className={c("wordCardTitle")}>
        <div className={c("index")}>{index + 1}</div>
        <div className={c("actions")}>
          <span className={c("icon")}>
            <FontAwesomeIcon icon={faGripLines} />
          </span>
          <span className={c("icon", "trash")} onClick={() => onRemove(index)}>
            <FontAwesomeIcon icon={faTrash} />
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={c("wordCardInput")}>
        {[
          { field: "term", label: "Thuật ngữ" },
          { field: "ipa", label: "IPA" },
          { field: "partOfSpeech", label: "Loại từ" },
          { field: "meaning", label: "Nghĩa" },
        ].map(({ field, label }) => (
          <div key={field} className={c("input")}>
            <textarea
              className={c("text-input")}
              placeholder={label}
              rows={1}
              value={word[field]}
              onChange={(e) => onChangeWord(index, field, e.target.value)}
            />
            <div className={c("sub-input")}>
              <span>{label}</span>
              <span>0/500</span>
            </div>
          </div>
        ))}

        {/* Thumbnail */}
        <div className={c("image")} onClick={() => toggleDialog("thumbnail")}>
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
      <div
        className={c("image-modal-backdrop", {
          "d-none": !openDialog.thumbnail,
        })}
        onClick={() => toggleDialog("thumbnail")}
      >
        <div className={c("image-modal")} onClick={(e) => e.stopPropagation()}>
          <div className={c("modal-header")}>
            <h5>Chọn ảnh minh họa</h5>
          </div>

          {/* Tabs */}
          <div className={c("tabs")}>
            <button
              className={c("tab", { active: activeTab === "search" })}
              onClick={() => setActiveTab("search")}
            >
              <FontAwesomeIcon icon={faSearch} /> Tìm ảnh
            </button>
            <button
              className={c("tab", { active: activeTab === "url" })}
              onClick={() => setActiveTab("url")}
            >
              <FontAwesomeIcon icon={faLink} /> URL
            </button>
          </div>

          <div className={c("modal-body")}>
            {/* Tab Tìm ảnh */}
            {activeTab === "search" && (
              <div>
                <div className={c("search-bar")}>
                  <input
                    type="text"
                    className={c("search-input")}
                    placeholder="Từ khóa (ví dụ: dog, cat...)"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <Button
                    label="Tìm"
                    size="sm"
                    onClick={() => fetchTermImages()}
                  />
                </div>

                {/* Nếu không có ảnh */}
                {searchResults.length === 0 ? (
                  <p className={c("no-results")}>
                    Chưa có ảnh. Nhấn "Tìm" để lấy ảnh cho "
                    <strong>{searchKeyword}</strong>"
                  </p>
                ) : (
                  // Nếu có ảnh, hiển thị danh sách
                  <div className={c("image-list")}>
                    {searchResults.map((image) => (
                      <div onClick={() => alert("abc" + image.url.id)}>
                        <img
                          key={image.id}
                          src={`${API_URL}${image.url}`}
                          alt="term media"
                          className={c("image-item")}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab URL */}
            {activeTab === "url" && (
              <div>
                <label className={c("label")}>Dán URL ảnh:</label>
                <input
                  type="text"
                  className={c("url-input")}
                  placeholder="https://example.com/image.jpg"
                  value={word.thumbnail}
                  onChange={(e) =>
                    onChangeWord(index, "thumbnail", e.target.value)
                  }
                />
                <div className={c("preview")}>
                  <Image
                    src={
                      word?.thumbnail != "" ? word?.thumbnail : Images.noImage
                    }
                    size="150px"
                  />
                </div>
              </div>
            )}
          </div>

          <div className={c("modal-footer")}>
            <Button label="Đóng" onClick={() => toggleDialog("thumbnail")} />
          </div>
        </div>
      </div>
    </div>
  );
}
