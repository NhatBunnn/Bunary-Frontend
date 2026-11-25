import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./WordInput.module.css";
import {
  Trash2,
  Image as ImageIcon,
  Search,
  Link as LinkIcon,
  X,
  Loader2,
} from "lucide-react";
import useWordInput from "./useWordInput";
import { API_URL } from "@config/apiConfig";

const cx = classNames.bind(styles);

export default function WordInput({ word, onChangeWord, onRemove, index }) {
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("search"); // "search" | "url"

  const {
    searchResults,
    searchKeyword,
    fetchTermImages,
    setSearchKeyword,
    loading: searchKeywordLoading,
  } = useWordInput();

  useEffect(() => {
    if (word?.term) {
      setSearchKeyword(word.term);
    }
  }, [word?.term, setSearchKeyword]);

  const handleOpenModal = () => {
    setOpenModal(true);
    if (word?.term && searchResults.length === 0) {
      fetchTermImages();
    }
  };

  return (
    <div className={cx("wordCard")}>
      {/* ===== CARD HEADER ===== */}
      <div className={cx("cardHeader")}>
        <div className={cx("cardHeaderLeft")}>
          <div className={cx("indexBadge")}>{index + 1}</div>
          {word?.term && (
            <span className={cx("termPreview")} title={word.term}>
              {word.term}
            </span>
          )}
        </div>

        <div className={cx("cardActions")}>
          <button
            type="button"
            className={cx("deleteBtn")}
            onClick={() => onRemove(index, word)}
            title="Xóa thẻ từ này"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ===== CARD BODY ===== */}
      <div className={cx("cardBody")}>
        {/* Thuật ngữ */}
        <div className={cx("inputField")}>
          <label className={cx("inputLabel")}>
            Thuật ngữ (English) <span className={cx("requiredMark")}>*</span>
          </label>
          <input
            type="text"
            className={cx("styledInput")}
            placeholder="Ví dụ: resilience"
            value={word?.term || ""}
            onChange={(e) => onChangeWord(index, "term", e.target.value)}
          />
        </div>

        {/* Phiên âm IPA */}
        <div className={cx("inputField")}>
          <label className={cx("inputLabel")}>Phiên âm (IPA)</label>
          <input
            type="text"
            className={cx("styledInput")}
            placeholder="e.g. /rɪˈzɪl.jəns/"
            value={word?.ipa || ""}
            onChange={(e) => onChangeWord(index, "ipa", e.target.value)}
          />
        </div>

        {/* Loại từ */}
        <div className={cx("inputField")}>
          <label className={cx("inputLabel")}>Loại từ</label>
          <input
            type="text"
            className={cx("styledInput")}
            placeholder="noun, verb, adj..."
            value={word?.partOfSpeech || ""}
            onChange={(e) => onChangeWord(index, "partOfSpeech", e.target.value)}
          />
        </div>

        {/* Nghĩa */}
        <div className={cx("inputField")}>
          <label className={cx("inputLabel")}>
            Nghĩa tiếng Việt <span className={cx("requiredMark")}>*</span>
          </label>
          <input
            type="text"
            className={cx("styledInput")}
            placeholder="Ví dụ: sự kiên cường, khả năng phục hồi"
            value={word?.meaning || ""}
            onChange={(e) => onChangeWord(index, "meaning", e.target.value)}
          />
        </div>

        {/* Ảnh minh họa */}
        <div className={cx("imageBox")}>
          <label className={cx("inputLabel")}>Ảnh</label>
          <div
            className={cx("thumbnailButton")}
            onClick={handleOpenModal}
            title="Bấm để chọn hoặc tìm ảnh minh họa"
          >
            {word?.thumbnail ? (
              <>
                <img
                  src={
                    word.thumbnail.startsWith("http")
                      ? word.thumbnail
                      : `${API_URL}${word.thumbnail}`
                  }
                  alt="Term thumb"
                  className={cx("thumbImg")}
                />
                <div className={cx("thumbHoverOverlay")}>
                  <ImageIcon size={14} />
                  <span>Đổi ảnh</span>
                </div>
              </>
            ) : (
              <>
                <ImageIcon size={18} />
                <span>+ Ảnh</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== IMAGE PICKER MODAL ===== */}
      {openModal && (
        <div className={cx("modalBackdrop")} onClick={() => setOpenModal(false)}>
          <div
            className={cx("imageModal")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cx("modalHeader")}>
              <h5 className={cx("modalTitle")}>Chọn ảnh cho "{word?.term || "từ này"}"</h5>
              <button
                type="button"
                className={cx("modalCloseBtn")}
                onClick={() => setOpenModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className={cx("modalTabs")}>
              <button
                type="button"
                className={cx("tabBtn", { tabBtnActive: activeTab === "search" })}
                onClick={() => setActiveTab("search")}
              >
                <Search size={15} /> Tìm từ kho ảnh
              </button>
              <button
                type="button"
                className={cx("tabBtn", { tabBtnActive: activeTab === "url" })}
                onClick={() => setActiveTab("url")}
              >
                <LinkIcon size={15} /> Dán link URL
              </button>
            </div>

            <div className={cx("modalBody")}>
              {/* Tab Search */}
              {activeTab === "search" && (
                <div>
                  <div className={cx("searchBar")}>
                    <input
                      type="text"
                      className={cx("modalSearchInput")}
                      placeholder="Nhập từ khóa tìm ảnh..."
                      value={searchKeyword || ""}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && fetchTermImages()}
                    />
                    <button
                      type="button"
                      className={cx("searchActionBtn")}
                      onClick={() => fetchTermImages()}
                      disabled={searchKeywordLoading}
                    >
                      {searchKeywordLoading ? (
                        <Loader2 size={16} className="rotate" />
                      ) : (
                        "Tìm ảnh"
                      )}
                    </button>
                  </div>

                  {searchResults.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 0", color: "#718096", fontSize: "13.5px" }}>
                      Chưa có kết quả. Nhấn "Tìm ảnh" để tìm hình minh họa phù hợp.
                    </div>
                  ) : (
                    <div className={cx("imageList")}>
                      {searchResults.map((image) => (
                        <div
                          key={image.id}
                          className={cx("imageItemWrapper")}
                          onClick={() => {
                            onChangeWord(index, "thumbnail", image.url);
                            setOpenModal(false);
                          }}
                        >
                          <img
                            src={`${API_URL}${image.url}`}
                            alt="Media result"
                            className={cx("imageItem")}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab URL */}
              {activeTab === "url" && (
                <div className={cx("urlInputBox")}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568" }}>
                    Dán đường dẫn ảnh trực tiếp:
                  </label>
                  <input
                    type="text"
                    className={cx("urlInput")}
                    placeholder="https://example.com/image.jpg"
                    value={word?.thumbnail || ""}
                    onChange={(e) => onChangeWord(index, "thumbnail", e.target.value)}
                  />
                  {word?.thumbnail && (
                    <div className={cx("urlPreviewWrapper")}>
                      <img
                        src={word.thumbnail}
                        alt="Preview URL"
                        className={cx("urlPreviewImg")}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={cx("modalFooter")}>
              {word?.thumbnail && (
                <button
                  type="button"
                  style={{
                    marginRight: "auto",
                    background: "none",
                    border: "none",
                    color: "#e53e3e",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onChangeWord(index, "thumbnail", "");
                    setOpenModal(false);
                  }}
                >
                  Xóa ảnh hiện tại
                </button>
              )}
              <button
                type="button"
                className={cx("modalCloseFooterBtn")}
                onClick={() => setOpenModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
