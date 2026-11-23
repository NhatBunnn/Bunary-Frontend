// WordSetForm.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./WordSetForm.module.css";
import classNames from "classnames/bind";
import {
  faEarth,
  faGear,
  faPlus,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import TitleSection from "@components/TitleSection";
import Button from "@components/Button/Button";
import ValidateInput from "@components/ValidateInput";
import { useNotification } from "@context/NotificationProvider";
import useWordSetForm from "@features/wordsets/hooks/useWordSetForm";
import { useEffect, useRef, useState } from "react";
import WordInput from "./components/WordInput/WordInput";
import { DialogWrapper, OptionsMenuWrapper } from "@components/index";
import { EditVisibilityDialog } from "./components/Dialogs";
import BulkImport from "./components/Dialogs/BulkImport/BulkImport";
import AiUsageModal from "./components/AiUsageModal/AiUsageModal";
import SuggestWordsModal from "./components/SuggestWordsModal/SuggestWordsModal";
import { useFetcher } from "@api/fetcher";
import { getAiUsage, buyAiCredits, autoFillWords, suggestWords } from "@api/aiApi";
import { Sparkles, Wand2 } from "lucide-react";

const c = classNames.bind(styles);

export default function WordSetForm({ type = "CREATE" }) {
  const { showNotification } = useNotification();
  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);
  const dropdownRef = useRef(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const { fetcher } = useFetcher();

  const [aiUsage, setAiUsage] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isBuyingCredits, setIsBuyingCredits] = useState(false);

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

  const [openDialog, setOpenDialog] = useState({});

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
  }, []);

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
          // Nếu form hiện chỉ có đúng 1 thẻ trống, thay thế thẻ đó
          const isInitialEmpty =
            prev.length === 1 &&
            (!prev[0].term || prev[0].term.trim() === "") &&
            (!prev[0].meaning || prev[0].meaning.trim() === "");

          return isInitialEmpty ? newWords : [...prev, ...newWords];
        });

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
          "Bạn không đủ Tinh thể để mua gói Credit này!",
          "error"
        );
      } else {
        showNotification(e?.message || "Mua AI Credits thất bại", "error");
      }
    } finally {
      setIsBuyingCredits(false);
    }
  };

  const addWordCard = () => {
    setWordInputs((prev) => [
      ...prev,
      { term: "", ipa: "", partOfSpeech: "", meaning: "", thumbnail: null },
    ]);
  };

  const removeWordCard = (word) => {
    if (wordInputs?.length <= 1) {
      return showNotification(
        "Không thể xóa, mỗi bộ phải có ít nhất 1 thẻ",
        "error"
      );
    }
    if (word.id) {
      setRemovedWordIds((prev) => [...prev, word.id]);
    }
    setWordInputs((prev) => prev.filter((data) => data !== word));
  };

  const handleChangeWordInputs = (index, field, value) => {
    const newWordInputs = [...wordInputs];
    newWordInputs[index][field] = value;
    setWordInputs(newWordInputs);
  };

  const handleToggleOptionsMenu = () => {
    setOpenOptionsMenu((prev) => !prev);
  };

  const handleToggleDialog = (type) => {
    setOpenDialog((prev) => ({ ...prev, [type]: !prev[type] }));
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

  const thumbnailUrl = wordSetInput.thumbnailFile
    ? URL.createObjectURL(wordSetInput.thumbnailFile)
    : wordSetInput.thumbnail || null;

  return (
    <div className={c("wordSetForm")}>
      {/* BULK IMPORT MODAL */}
      <BulkImport
        show={showBulkImport}
        onHide={() => setShowBulkImport(false)}
        onImport={handleBulkImport}
      />

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

      {/* DIALOG QUYỀN RIÊNG TƯ */}
      {/* <DialogWrapper
        title="Chỉnh sửa quyền riêng tư"
        onClose={() => handleToggleDialog("privacy")}
        isOpen={openDialog.privacy}
      >
        <EditVisibilityDialog
          wordSetInput={wordSetInput}
          setWordSetInput={setWordSetInput}
        />
      </DialogWrapper> */}

      {/* TITLE */}
      <TitleSection
        title={type === "CREATE" ? "Tạo bộ từ vựng mới" : "Chỉnh sửa bộ từ"}
      >
        <Button
          label={type === "CREATE" ? "Tạo bộ" : "Cập nhật"}
          onClick={
            type === "CREATE" ? handleCreateWordSet : handleUpdateWordSet
          }
          isLoading={loading}
          variant="primary"
        />
      </TitleSection>

      {/* FORM INPUT */}
      <div className={c("form-grid")}>
        <div className={c("input-group")}>
          <ValidateInput
            field="name"
            fieldErrors={fieldErrors}
            value={wordSetInput.name}
            onChange={(e) => setWordSetInput((prev) => ({ ...prev, name: e }))}
            placeholder="Tiêu đề bộ từ (bắt buộc)"
          />
          <textarea
            value={wordSetInput.description || ""}
            onChange={(e) =>
              setWordSetInput((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Mô tả ngắn gọn về bộ từ (không bắt buộc)"
            className={c("desc-input")}
            rows={3}
          />
        </div>

        <div className={c("thumbnail-upload")}>
          <input
            accept="image/*"
            type="file"
            id="thumbnail-input"
            onChange={(e) =>
              setWordSetInput((prev) => ({
                ...prev,
                thumbnailFile: e.target.files[0],
              }))
            }
            className={c("hidden-input")}
          />
          <label htmlFor="thumbnail-input" className={c("thumbnail-label")}>
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt="Preview"
                className={c("thumbnail-preview")}
              />
            ) : (
              <div className={c("thumbnail-placeholder")}>
                <FontAwesomeIcon icon={faImage} size="2x" />
                <span>Thêm ảnh bìa</span>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className={c("toolbar")}>
        <div className={c("toolbar-left")}>
          <Button
            label="Thêm nhiều từ"
            variant="outline"
            size="sm"
            onClick={() => setShowBulkImport(true)}
          />
          <Button
            label="Sửa chính tả"
            variant="outline"
            size="sm"
            className={c("ms-2")}
          />
          <Button
            label="Tự động điền"
            variant="outline"
            size="sm"
            className={c("ms-2", "btn-autofill")}
            onClick={handleAutoFill}
            isLoading={isAutoFilling}
          />
          <Button
            label="Gợi ý từ"
            variant="outline"
            size="sm"
            className={c("ms-2", "btn-suggest-ai")}
            onClick={() => setShowSuggestModal(true)}
          />
          <div
            className={c("ai-usage-pill", "ms-2")}
            onClick={() => setShowAiModal(true)}
            title="Nhấn để xem hạn mức & mua thêm AI Credits"
          >
            <Sparkles size={14} className={c("ai-pill-icon")} />
            <span className={c("ai-pill-label")}>AI Usage:</span>
            <span className={c("ai-pill-value")}>
              {aiUsage ? `${aiUsage.freeRemaining + aiUsage.bonusCredits}/${aiUsage.dailyLimit + aiUsage.bonusCredits}` : "10/10"}
            </span>
            <span className={c("ai-pill-plus")}>+</span>
          </div>
        </div>

        <div className={c("toolbar-right")} ref={dropdownRef}>
          {/* LEVEL SELECT */}
          <select
            value={wordSetInput.level || ""}
            onChange={(e) =>
              setWordSetInput((prev) => ({ ...prev, level: e.target.value }))
            }
            className={c("toolbar-select")}
            title="Trình độ (A1-C2)"
          >
            <option value="">Lv</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>

          {/* TAG SELECT */}
          <select
            value={wordSetInput.tag || ""}
            onChange={(e) =>
              setWordSetInput((prev) => ({ ...prev, tag: e.target.value }))
            }
            className={c("toolbar-select")}
            title="Chủ đề / Thẻ"
          >
            <option value="">Tag</option>
            <option value="ielts">IELTS</option>
            <option value="toeic">TOEIC</option>
            <option value="toefl">TOEFL</option>
            <option value="daily">Hằng ngày</option>
            <option value="business">Kinh doanh</option>
            <option value="travel">Du lịch</option>
          </select>

          {/* VISIBILITY SELECT */}
          <select
            value={wordSetInput.visibility}
            onChange={(e) =>
              setWordSetInput((prev) => ({
                ...prev,
                visibility: e.target.value,
              }))
            }
            className={c("toolbar-select")}
            title="Công khai / Riêng tư"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>

          {/* NÚT SETTINGS */}
          {/* <Button
            icon={<FontAwesomeIcon icon={faGear} />}
            variant="icon"
            onClick={handleToggleOptionsMenu}
          /> */}

          {/* MENU CŨ */}
          {openOptionsMenu && (
            <OptionsMenuWrapper className={c("options-menu")}>
              <Button
                label="Chỉnh sửa quyền riêng tư"
                icon={<FontAwesomeIcon icon={faEarth} />}
                variant="menu"
                onClick={() => {
                  handleToggleDialog("privacy");
                  setOpenOptionsMenu(false);
                }}
              />
            </OptionsMenuWrapper>
          )}
        </div>
      </div>

      {/* WORD CARDS */}
      <div className={c("word-cards")}>
        {wordInputs?.map((word, index) => (
          <WordInput
            key={word.id || index}
            index={index}
            word={word}
            onChangeWord={handleChangeWordInputs}
            onRemove={() => removeWordCard(word)}
          />
        ))}
      </div>

      {/* ADD CARD BUTTON */}
      <div className={c("add-card-section")}>
        <Button
          label="Thêm thẻ từ mới"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={addWordCard}
          variant="secondary"
          className={c("add-card-btn")}
        />
      </div>

      {/* AI USAGE MODAL */}
      <AiUsageModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        usage={aiUsage || {}}
        onBuyCredits={handleBuyCredits}
        isBuying={isBuyingCredits}
      />
    </div>
  );
}
