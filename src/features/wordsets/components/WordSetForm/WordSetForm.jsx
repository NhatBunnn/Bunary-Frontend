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

const c = classNames.bind(styles);

export default function WordSetForm({ type = "CREATE" }) {
  const { showNotification } = useNotification();
  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);
  const dropdownRef = useRef(null);

  const [showBulkImport, setShowBulkImport] = useState(false);

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

  const [openDialog, setOpenDialog] = useState({ privacy: false });

  useEffect(() => {
    if (type === "UPDATE") {
      handleFindWordSetById();
    }
  }, []);

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

  // Preview ảnh thumbnail
  const thumbnailUrl = wordSetInput.thumbnailFile
    ? URL.createObjectURL(wordSetInput.thumbnailFile)
    : wordSetInput.thumbnail || null;

  return (
    <div className={c("wordSetForm")}>
      {/* === BULK IMPORT MODAL === */}
      <BulkImport
        show={showBulkImport}
        onHide={() => setShowBulkImport(false)}
        onImport={handleBulkImport}
      />

      {/* Dialog chỉnh sửa quyền riêng tư */}
      <DialogWrapper
        title="Chỉnh sửa quyền riêng tư"
        onClose={() => handleToggleDialog("privacy")}
        isOpen={openDialog.privacy}
      >
        <EditVisibilityDialog
          wordSetInput={wordSetInput}
          setWordSetInput={setWordSetInput}
        />
      </DialogWrapper>

      {/* Title */}
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

      {/* Form Input */}
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

      {/* Toolbar */}
      <div className={c("toolbar")}>
        <div className={c("toolbar-left")}>
          {/* NÚT MỞ BULK IMPORT */}
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
        </div>
        <div className={c("toolbar-right")} ref={dropdownRef}>
          <Button
            icon={<FontAwesomeIcon icon={faGear} />}
            variant="icon"
            onClick={handleToggleOptionsMenu}
          />
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

      {/* Word Cards List */}
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

      {/* Add Card Button */}
      <div className={c("add-card-section")}>
        <Button
          label="Thêm thẻ từ mới"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={addWordCard}
          variant="secondary"
          className={c("add-card-btn")}
        />
      </div>
    </div>
  );
}
