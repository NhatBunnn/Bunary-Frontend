// WordSetForm.jsx - Redesigned & Fully Responsive
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./WordSetForm.module.css";
import { useNotification } from "@context/NotificationProvider";
import useWordSetForm from "@features/wordsets/hooks/useWordSetForm";
import WordInput from "./components/WordInput/WordInput";
import BulkImport from "./components/Dialogs/BulkImport/BulkImport";
import AiUsageModal from "./components/AiUsageModal/AiUsageModal";
import SuggestWordsModal from "./components/SuggestWordsModal/SuggestWordsModal";
import { useFetcher } from "@api/fetcher";
import { getAiUsage, buyAiCredits, autoFillWords, suggestWords } from "@api/aiApi";
import { API_URL } from "@config/apiConfig";
import {
  Sparkles,
  Wand2,
  Plus,
  ArrowLeft,
  BookPlus,
  Edit3,
  Image as ImageIcon,
  Check,
  Save,
  Loader2,
  FileUp,
  GraduationCap,
  Tag,
  Globe,
  Lock,
  Info,
  Search,
  Link as LinkIcon,
  X,
  Trash2,
} from "lucide-react";

const cx = classNames.bind(styles);

export default function WordSetForm({ type = "CREATE" }) {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { fetcher } = useFetcher();

  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isBuyingCredits, setIsBuyingCredits] = useState(false);
  const [aiUsage, setAiUsage] = useState(null);

  // State cho Modal chọn ảnh bìa (Kho ảnh từ điển / Dán link URL)
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [coverTab, setCoverTab] = useState("search"); // "search" | "url"
  const [coverKeyword, setCoverKeyword] = useState("");
  const [coverResults, setCoverResults] = useState([]);
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverUrlInput, setCoverUrlInput] = useState("");

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const fetchCoverImages = async (kw) => {
    const keywordToSearch = (kw !== undefined ? kw : coverKeyword)?.trim();
    if (!keywordToSearch) {
      return showNotification("Vui lòng nhập từ khóa tìm ảnh!", "warning");
    }
    setCoverLoading(true);
    try {
      const response = await fetcher({
        url: "/api/v1/wordresources/search",
        method: "GET",
        params: {
          keyword: keywordToSearch,
        },
      });
      let result = [];
      if (Array.isArray(response?.data)) {
        response.data.forEach((item) => {
          if (item.images && Array.isArray(item.images)) {
            result = [...result, ...item.images];
          }
        });
      }
      setCoverResults(result);
      if (result.length === 0) {
        showNotification("Không tìm thấy ảnh nào với từ khóa này.", "info");
      }
    } catch (e) {
      console.error("Error searching cover images:", e);
      showNotification("Có lỗi xảy ra khi tìm ảnh từ kho.", "error");
    } finally {
      setCoverLoading(false);
    }
  };

  const handleOpenCoverModal = () => {
    setShowCoverModal(true);
    if (!coverKeyword.trim()) {
      const initialKw =
        wordSetInput.name?.trim() || wordInputs[0]?.term?.trim() || "";
      setCoverKeyword(initialKw);
      if (initialKw && coverResults.length === 0) {
        fetchCoverImages(initialKw);
      }
    }
  };

  const handleSelectCoverImage = (imgUrl) => {
    setWordSetInput((prev) => ({
      ...prev,
      thumbnail: imgUrl,
      thumbnailFile: null,
    }));
    setShowCoverModal(false);
    showNotification("Đã chọn ảnh bìa thành công!", "success");
  };

  const handleConfirmCoverUrl = () => {
    if (!coverUrlInput.trim()) {
      return showNotification("Vui lòng nhập đường dẫn URL ảnh!", "warning");
    }
    setWordSetInput((prev) => ({
      ...prev,
      thumbnail: coverUrlInput.trim(),
      thumbnailFile: null,
    }));
    setShowCoverModal(false);
    showNotification("Đã cập nhật ảnh bìa từ URL!", "success");
  };

  const handleRemoveCover = () => {
    setWordSetInput((prev) => ({
      ...prev,
      thumbnail: "",
      thumbnailFile: null,
    }));
    showNotification("Đã xóa ảnh bìa.", "info");
  };

  const {
    handleCreateWordSet,
    handleUpdateWordSet,
    handleFindWordSetById,
    setRemovedWordIds,
    fieldErrors,
    setWordSetInput,
    wordSetInput,
    wordInputs,
    setWordInputs,
    loading,
  } = useWordSetForm();

  // Load initial data
  useEffect(() => {
    if (type === "UPDATE") {
      handleFindWordSetById();
    }

    const fetchUsage = async () => {
      try {
        const res = await getAiUsage(fetcher);
        if (res?.data) {
          setAiUsage(res.data);
        }
      } catch (err) {
        console.error("Failed to load AI usage", err);
      }
    };
    fetchUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tự động điền dữ liệu từ kho từ điển cho các từ đã nhập
  const handleAutoFill = async () => {
    const hasAnyTerm = wordInputs.some((w) => w.term && w.term.trim() !== "");
    if (!hasAnyTerm) {
      return showNotification(
        "Vui lòng điền thuật ngữ trước khi bấm Tự động điền!",
        "warning"
      );
    }

    setIsAutoFilling(true);
    try {
      const terms = wordInputs.map((w) => w.term?.trim() || "");
      const res = await autoFillWords(fetcher, terms);

      if (res?.data?.results) {
        const results = res.data.results;
        let filledCount = 0;

        const updatedWords = wordInputs.map((w, idx) => {
          const match = results[idx];
          if (match && match.found) {
            filledCount++;
            return {
              ...w,
              ipa: w.ipa?.trim() ? w.ipa : match.ipa || "",
              partOfSpeech: w.partOfSpeech?.trim()
                ? w.partOfSpeech
                : match.partOfSpeech || "",
              meaning: w.meaning?.trim() ? w.meaning : match.meaning || "",
              thumbnail: w.thumbnail ? w.thumbnail : match.thumbnail || "",
            };
          }
          return w;
        });

        setWordInputs(updatedWords);
        if (res.data.usage) {
          setAiUsage(res.data.usage);
        }

        if (filledCount > 0) {
          showNotification(
            `Đã tự động điền thành công ${filledCount} từ!`,
            "success"
          );
        } else {
          showNotification(
            "Không tìm thấy dữ liệu từ điển cho các từ này.",
            "warning"
          );
        }
      }
    } catch (e) {
      if (e?.errorCode === "AI_USAGE_EXHAUSTED" || e?.status === 429) {
        showNotification(
          "Bạn đã hết lượt sử dụng AI hôm nay. Hãy nâng cấp thêm AI Credits!",
          "warning"
        );
        setShowAiModal(true);
      } else {
        showNotification(
          e?.message || "Có lỗi xảy ra khi tự động điền",
          "error"
        );
      }
    } finally {
      setIsAutoFilling(false);
    }
  };

  // Gợi ý từ vựng qua AI
  const handleSuggestWords = async (payload) => {
    setIsSuggesting(true);
    try {
      const res = await suggestWords(fetcher, payload);
      if (res?.data?.words && res.data.words.length > 0) {
        const newWords = res.data.words.map((w) => ({
          term: w.term || "",
          meaning: w.meaning || "",
          ipa: w.ipa || "",
          partOfSpeech: w.partOfSpeech || "",
          thumbnail: w.thumbnail || null,
        }));

        setWordInputs((prev) => {
          const isInitialEmpty =
            prev.length === 1 &&
            (!prev[0].term || prev[0].term.trim() === "") &&
            (!prev[0].meaning || prev[0].meaning.trim() === "");

          return isInitialEmpty ? newWords : [...prev, ...newWords];
        });

        // Tự động điền mô tả (nếu chưa có hoặc AI sinh ra) và ảnh bìa gợi ý
        setWordSetInput((prev) => ({
          ...prev,
          description: prev.description?.trim()
            ? prev.description
            : res.data.description || prev.description,
          thumbnail: res.data.suggestedThumbnail || prev.thumbnail,
          thumbnailFile: null,
        }));

        if (res.data.usage) {
          setAiUsage(res.data.usage);
        }

        setShowSuggestModal(false);
        showNotification(
          `AI đã gợi ý thành công ${newWords.length} từ vựng!`,
          "success"
        );
      }
    } catch (e) {
      if (e?.errorCode === "AI_USAGE_EXHAUSTED" || e?.status === 429) {
        showNotification(
          "Bạn đã hết lượt sử dụng AI hôm nay. Hãy nâng cấp thêm AI Credits!",
          "warning"
        );
        setShowSuggestModal(false);
        setShowAiModal(true);
      } else {
        showNotification(
          e?.message || "Có lỗi xảy ra khi gợi ý từ vựng bằng AI",
          "error"
        );
      }
    } finally {
      setIsSuggesting(false);
    }
  };

  // Mua thêm Credits
  const handleBuyCredits = async (credits) => {
    setIsBuyingCredits(true);
    try {
      const res = await buyAiCredits(fetcher, credits);
      if (res?.data) {
        setAiUsage(res.data);
        showNotification(`Mua thành công ${credits} AI Credits!`, "success");
      }
    } catch (e) {
      if (e?.errorCode === "INSUFFICIENT_CRYSTAL") {
        showNotification(
          "Bạn không đủ Crystal để mua gói Credit này!",
          "error"
        );
      } else {
        showNotification(e?.message || "Mua AI Credits thất bại", "error");
      }
    } finally {
      setIsBuyingCredits(false);
    }
  };

  // Thêm / xóa thẻ từ
  const addWordCard = () => {
    setWordInputs((prev) => [
      ...prev,
      { term: "", ipa: "", partOfSpeech: "", meaning: "", thumbnail: null },
    ]);
  };

  const removeWordCard = (index, word) => {
    if (wordInputs?.length <= 1) {
      return showNotification(
        "Không thể xóa, mỗi bộ phải có ít nhất 1 thẻ!",
        "error"
      );
    }
    if (word?.id) {
      setRemovedWordIds((prev) => [...prev, word.id]);
    }
    setWordInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeWordInputs = (index, field, value) => {
    const newWordInputs = [...wordInputs];
    newWordInputs[index][field] = value;
    setWordInputs(newWordInputs);
  };

  const handleBulkImport = (words) => {
    const newWords = words.map((w) => ({
      term: w.term,
      meaning: w.meaning,
      ipa: w.ipa || "",
      partOfSpeech: w.partOfSpeech || "",
      thumbnail: w.thumbnail || null,
    }));
    setWordInputs((prev) => [...prev, ...newWords]);
    showNotification(`Đã thêm ${newWords.length} thẻ từ!`, "success");
  };

  const isFormValid = wordInputs.length >= 3;
  const isCreateMode = type === "CREATE";

  return (
    <div className={cx("formContainer")}>
      {/* BULK IMPORT MODAL */}
      <BulkImport
        show={showBulkImport}
        onHide={() => setShowBulkImport(false)}
        onImport={handleBulkImport}
      />

      {/* COVER IMAGE MODAL (Kho ảnh từ điển & Dán link URL) */}
      {showCoverModal && (
        <div
          className={cx("coverModalBackdrop")}
          onClick={() => setShowCoverModal(false)}
        >
          <div
            className={cx("coverModal")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cx("modalHeader")}>
              <h5 className={cx("modalTitle")}>Chọn ảnh bìa cho bộ từ</h5>
              <button
                type="button"
                className={cx("modalCloseBtn")}
                onClick={() => setShowCoverModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className={cx("modalTabs")}>
              <button
                type="button"
                className={cx("tabBtn", { tabBtnActive: coverTab === "search" })}
                onClick={() => setCoverTab("search")}
              >
                <Search size={15} /> Tìm từ kho ảnh
              </button>
              <button
                type="button"
                className={cx("tabBtn", { tabBtnActive: coverTab === "url" })}
                onClick={() => setCoverTab("url")}
              >
                <LinkIcon size={15} /> Dán link URL
              </button>
            </div>

            <div className={cx("modalBody")}>
              {coverTab === "search" && (
                <div>
                  <div className={cx("searchBar")}>
                    <input
                      type="text"
                      className={cx("modalSearchInput")}
                      placeholder="Nhập từ khóa tìm ảnh (ví dụ: environment, animals, travel)..."
                      value={coverKeyword}
                      onChange={(e) => setCoverKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && fetchCoverImages()}
                    />
                    <button
                      type="button"
                      className={cx("searchActionBtn")}
                      onClick={() => fetchCoverImages()}
                      disabled={coverLoading}
                    >
                      {coverLoading ? (
                        <Loader2 size={16} className="rotate" />
                      ) : (
                        "Tìm ảnh"
                      )}
                    </button>
                  </div>

                  {coverResults.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "30px 0",
                        color: "#718096",
                        fontSize: "13.5px",
                      }}
                    >
                      {coverLoading
                        ? "Đang tìm ảnh trong kho từ điển..."
                        : "Chưa có ảnh nào. Nhập từ khóa và bấm \"Tìm ảnh\" để tìm hình phù hợp."}
                    </div>
                  ) : (
                    <div className={cx("imageList")}>
                      {coverResults.map((image) => (
                        <div
                          key={image.id}
                          className={cx("imageItemWrapper")}
                          onClick={() => handleSelectCoverImage(image.url)}
                          title="Bấm để chọn làm ảnh bìa"
                        >
                          <img
                            src={getFullImageUrl(image.url)}
                            alt="Cover option"
                            className={cx("imageItem")}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {coverTab === "url" && (
                <div className={cx("urlInputBox")}>
                  <label
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#4a5568",
                    }}
                  >
                    Dán đường dẫn URL ảnh trực tiếp:
                  </label>
                  <input
                    type="text"
                    className={cx("urlInput")}
                    placeholder="https://images.unsplash.com/... hoặc link ảnh bất kỳ"
                    value={coverUrlInput}
                    onChange={(e) => setCoverUrlInput(e.target.value)}
                  />
                  {coverUrlInput.trim() && (
                    <div className={cx("urlPreviewWrapper")}>
                      <img
                        src={coverUrlInput.trim()}
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
              {coverTab === "url" && (
                <button
                  type="button"
                  className={cx("modalConfirmBtn")}
                  onClick={handleConfirmCoverUrl}
                >
                  Chọn ảnh này
                </button>
              )}
              <button
                type="button"
                className={cx("modalCloseFooterBtn")}
                onClick={() => setShowCoverModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI SUGGEST WORDS MODAL */}
      <SuggestWordsModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
        onSubmit={handleSuggestWords}
        currentTitle={wordSetInput.name}
        currentDescription={wordSetInput.description}
        initialLevel={wordSetInput.level}
        aiUsage={aiUsage}
        isGenerating={isSuggesting}
        onOpenAiModal={() => setShowAiModal(true)}
      />

      {/* AI USAGE MODAL */}
      <AiUsageModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        usage={aiUsage || {}}
        onBuyCredits={handleBuyCredits}
        isBuying={isBuyingCredits}
      />

      {/* ===== STICKY TOP HEADER BAR ===== */}
      <header className={cx("topHeader")}>
        <div className={cx("headerLeft")}>
          <button
            type="button"
            className={cx("backBtn")}
            onClick={() => navigate(-1)}
            title="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>
          <div className={cx("headerTitleWrapper")}>
            <h1 className={cx("pageTitle")}>
              {isCreateMode ? (
                <>
                  <BookPlus size={22} className={cx("pageTitleIcon")} /> Tạo bộ từ vựng mới
                </>
              ) : (
                <>
                  <Edit3 size={22} className={cx("pageTitleIcon")} /> Chỉnh sửa bộ từ vựng
                </>
              )}
            </h1>
            <div
              className={cx("wordCountBadge", {
                badgeSuccess: isFormValid,
                badgeWarning: !isFormValid,
              })}
            >
              📝 {wordInputs.length} thẻ từ {!isFormValid && "(tối thiểu 3 từ)"}
            </div>
          </div>
        </div>

        <div className={cx("headerActions")}>
          <button
            type="button"
            className={cx("submitBtn")}
            onClick={isCreateMode ? handleCreateWordSet : handleUpdateWordSet}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="rotate" /> Đang lưu...
              </>
            ) : isCreateMode ? (
              <>
                <Check size={18} /> Tạo bộ từ
              </>
            ) : (
              <>
                <Save size={18} /> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </header>

      {/* ===== GENERAL INFORMATION CARD ===== */}
      <section className={cx("infoCard")}>
        <div className={cx("cardSectionHeader")}>
          <Info size={18} className={cx("cardSectionIcon")} />
          <span>Thông tin cơ bản</span>
        </div>

        <div className={cx("infoGrid")}>
          <div className={cx("infoFields")}>
            {/* Tiêu đề */}
            <div className={cx("fieldGroup")}>
              <label htmlFor="title-input" className={cx("fieldLabel")}>
                Tiêu đề bộ từ <span className={cx("fieldRequired")}>*</span>
              </label>
              <input
                id="title-input"
                type="text"
                value={wordSetInput.name || ""}
                onChange={(e) =>
                  setWordSetInput((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nhập tiêu đề (ví dụ: 100 từ vựng IELTS chủ đề Environment)..."
                className={cx("mainTitleInput")}
              />
              {fieldErrors?.name && (
                <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                  {fieldErrors.name}
                </div>
              )}
            </div>

            {/* Mô tả */}
            <div className={cx("fieldGroup")}>
              <label htmlFor="desc-input" className={cx("fieldLabel")}>
                Mô tả bộ từ
              </label>
              <textarea
                id="desc-input"
                rows={3}
                value={wordSetInput.description || ""}
                onChange={(e) =>
                  setWordSetInput((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả mục đích, nội dung hoặc ghi chú cho bộ từ này..."
                className={cx("descTextarea")}
              />
            </div>

            {/* Metadata Selectors: Level, Tag, Visibility */}
            <div className={cx("metadataRow")}>
              <div className={cx("metaSelectBox")}>
                <label className={cx("metaLabel")}>
                  <GraduationCap size={15} /> Trình độ (CEFR)
                </label>
                <select
                  value={wordSetInput.level || ""}
                  onChange={(e) =>
                    setWordSetInput((prev) => ({ ...prev, level: e.target.value }))
                  }
                  className={cx("customSelect")}
                >
                  <option value="">Tất cả trình độ</option>
                  <option value="A1">A1 - Cơ bản</option>
                  <option value="A2">A2 - Sơ cấp</option>
                  <option value="B1">B1 - Trung cấp</option>
                  <option value="B2">B2 - Trung cao cấp</option>
                  <option value="C1">C1 - Cao cấp</option>
                  <option value="C2">C2 - Thành thạo</option>
                </select>
              </div>

              <div className={cx("metaSelectBox")}>
                <label className={cx("metaLabel")}>
                  <Tag size={15} /> Chủ đề / Tag
                </label>
                <select
                  value={wordSetInput.tag || ""}
                  onChange={(e) =>
                    setWordSetInput((prev) => ({ ...prev, tag: e.target.value }))
                  }
                  className={cx("customSelect")}
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="ielts">IELTS</option>
                  <option value="toeic">TOEIC</option>
                  <option value="toefl">TOEFL</option>
                  <option value="daily">Giao tiếp hằng ngày</option>
                  <option value="business">Kinh doanh / Công sở</option>
                  <option value="travel">Du lịch</option>
                </select>
              </div>

              <div className={cx("metaSelectBox")}>
                <label className={cx("metaLabel")}>
                  {wordSetInput.visibility === "PUBLIC" ? (
                    <Globe size={15} />
                  ) : (
                    <Lock size={15} />
                  )}{" "}
                  Quyền riêng tư
                </label>
                <select
                  value={wordSetInput.visibility || "PRIVATE"}
                  onChange={(e) =>
                    setWordSetInput((prev) => ({
                      ...prev,
                      visibility: e.target.value,
                    }))
                  }
                  className={cx("customSelect")}
                >
                  <option value="PUBLIC">Công khai (Mọi người đều thấy)</option>
                  <option value="PRIVATE">Riêng tư (Chỉ mình tôi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Thumbnail Box */}
          <div className={cx("thumbnailWrapper")}>
            <label className={cx("fieldLabel")}>Ảnh bìa bộ từ</label>
            <div
              className={cx("thumbnailLabel")}
              onClick={handleOpenCoverModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleOpenCoverModal()}
              style={{ cursor: "pointer" }}
            >
              {wordSetInput.thumbnail ? (
                <>
                  <img
                    src={getFullImageUrl(wordSetInput.thumbnail)}
                    alt="Cover preview"
                    className={cx("thumbnailPreview")}
                  />
                  <div className={cx("thumbnailOverlay")}>
                    <ImageIcon size={24} />
                    <span>Thay đổi ảnh bìa</span>
                  </div>
                </>
              ) : (
                <div className={cx("thumbnailPlaceholder")}>
                  <ImageIcon size={32} className={cx("placeholderIcon")} />
                  <span className={cx("placeholderText")}>+ Chọn ảnh bìa</span>
                  <span className={cx("placeholderHint")}>
                    Chọn từ kho ảnh hoặc dán link URL
                  </span>
                </div>
              )}
            </div>
            {wordSetInput.thumbnail && (
              <button
                type="button"
                className={cx("removeCoverBtn")}
                onClick={handleRemoveCover}
                title="Xóa ảnh bìa hiện tại"
              >
                <Trash2 size={13} /> Xóa ảnh bìa
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ===== SMART ACTION TOOLBAR ===== */}
      <section className={cx("smartToolbar")}>
        <div className={cx("toolbarLeft")}>
          <button
            type="button"
            className={cx("toolBtn", "btnAiSuggest")}
            onClick={() => setShowSuggestModal(true)}
            title="Sử dụng trí tuệ nhân tạo để gợi ý danh sách từ vựng theo chủ đề"
          >
            <Sparkles size={16} /> Gợi ý từ AI
          </button>

          <button
            type="button"
            className={cx("toolBtn", "btnAutoFill")}
            onClick={handleAutoFill}
            disabled={isAutoFilling}
            title="Tự động tra cứu từ điển để điền IPA, nghĩa và loại từ"
          >
            {isAutoFilling ? (
              <>
                <Loader2 size={16} className="rotate" /> Đang điền...
              </>
            ) : (
              <>
                <Wand2 size={16} /> Tự động điền
              </>
            )}
          </button>

          <div
            className={cx("aiPillBadge")}
            onClick={() => setShowAiModal(true)}
            title="Xem hạn mức AI & Mua thêm Credits"
          >
            <Sparkles size={14} color="#8b5cf6" />
            <span>AI:</span>
            <span className={cx("aiPillCount")}>
              {aiUsage
                ? `${aiUsage.freeRemaining + aiUsage.bonusCredits}/${
                    aiUsage.dailyLimit + aiUsage.bonusCredits
                  }`
                : "10/10"}
            </span>
            <span className={cx("aiPlusIcon")}>+</span>
          </div>
        </div>

        <div className={cx("toolbarRight")}>
          <button
            type="button"
            className={cx("toolBtn", "btnBulkImport")}
            onClick={() => setShowBulkImport(true)}
            title="Nhập hàng loạt từ vựng từ văn bản, Excel, Quizlet..."
          >
            <FileUp size={16} /> Nhập danh sách
          </button>
        </div>
      </section>

      {/* ===== WORD CARDS LIST ===== */}
      <div className={cx("cardsList")}>
        {wordInputs?.map((word, index) => (
          <WordInput
            key={word.id || index}
            index={index}
            word={word}
            onChangeWord={handleChangeWordInputs}
            onRemove={() => removeWordCard(index, word)}
          />
        ))}
      </div>

      {/* ===== BOTTOM ACTION SECTION ===== */}
      <div className={cx("bottomActionSection")}>
        <button
          type="button"
          className={cx("bigAddCardBtn")}
          onClick={addWordCard}
        >
          <Plus size={20} /> Thêm thẻ từ mới
        </button>

        <div className={cx("bottomSummaryBar")}>
          <div className={cx("summaryText")}>
            Tổng số: <span className={cx("summaryCount")}>{wordInputs.length} thẻ từ</span>{" "}
            {!isFormValid && (
              <span style={{ color: "#e53e3e", marginLeft: "6px" }}>
                (Cần tối thiểu 3 thẻ từ để tạo bộ)
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className={cx("toolBtn", "btnBulkImport")}
              onClick={addWordCard}
            >
              <Plus size={16} /> Thêm thẻ
            </button>
            <button
              type="button"
              className={cx("submitBtn")}
              onClick={isCreateMode ? handleCreateWordSet : handleUpdateWordSet}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="rotate" /> Đang lưu...
                </>
              ) : isCreateMode ? (
                <>
                  <Check size={18} /> Tạo bộ từ
                </>
              ) : (
                <>
                  <Save size={18} /> Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
