import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./WordSetForm.module.css";
import classNames from "classnames/bind";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import TitleSection from "@components/TitleSection";
import Button from "@components/Button";
import ValidateInput from "@components/ValidateInput";
import WordCardCreate from "@pages/CreateWordSet/components/WordCardCreate";
import { useNotification } from "@context/NotificationProvider";
import useWordSetForm from "@features/wordsets/hooks/useWordSetForm";
import { useEffect } from "react";
import WordInput from "./components/WordInput";

const c = classNames.bind(styles);

export default function WordSetForm({ type = "CREATE" }) {
  const { showNotification } = useNotification();

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
      wordInputs.forEach((d) => {
        if (d.id === word.id) {
          setRemovedWordIds((prev) => [...prev, word.id]);
        }
      });
    }
    setWordInputs((prev) =>
      prev.filter((data) => {
        return data !== word;
      })
    );
  };

  const handleChange = (index, field, value) => {
    const newWordInputs = [...wordInputs];
    newWordInputs[index][field] = value;
    setWordInputs(newWordInputs);
  };

  return (
    <div className={c("wordSetForm")}>
      {/* Title */}
      <TitleSection title="Tạo bộ từ vựng mới" onTop={true}>
        <Button
          label="Thêm"
          onClick={() => handleCreateWordSet()}
          isLoading={loading}
        />
        <Button
          label="Cập nhật"
          onClick={() => handleUpdateWordSet()}
          isLoading={loading}
        />
        <Button label="Sửa" />
      </TitleSection>
      {/* Input */}
      <div
        className={c(
          "wordset-input",
          "d-flex",
          "align-items-center",
          "justify-content-between",
          "mb-3"
        )}
      >
        <div
          className={c(
            "text-input",
            "d-flex",
            "flex-column",
            "w-100",
            "me-4",
            "h-100"
          )}
        >
          <ValidateInput
            field="name"
            fieldErrors={fieldErrors}
            value={wordSetInput.name}
            onChange={(e) => setWordSetInput((prev) => ({ ...prev, name: e }))}
            placeholder="   Tiêu đề"
            className={c("name", "mb-4", "outline-prmary")}
          />
          <input
            value={wordSetInput.description}
            onChange={(e) =>
              setWordSetInput((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="   Mô tả"
            className={c("desc", "outline-primary")}
          />
        </div>
        <div
          className={c(
            "image",
            "d-flex",
            "align-items-center",
            "justify-content-center"
          )}
        >
          <input
            accept="image/*"
            type="file"
            onChange={(e) =>
              setWordSetInput((prev) => ({
                ...prev,
                thumbnailFile: e.target.files[0],
              }))
            }
          />
          <FontAwesomeIcon icon={faImage} size="2x" />
        </div>
      </div>
      {/* Toolbar */}
      <div
        className={c("toolbar", "d-flex", "justify-content-between", "mb-4")}
      >
        <div className={c("button")}>
          <Button type="submit" label="Thêm nhiều từ" />
          <Button label="Sửa chính tả" />
        </div>
        <div className={c("setting")}>
          <Button icon={faGear} />
        </div>
      </div>
      {/* wordcarslist */}
      <div className={c("wordcarslist")}>
        {wordInputs?.map((wordInputs, i) => {
          return (
            <div key={i}>
              <WordInput
                index={i}
                word={wordInputs}
                onChange={handleChange}
                onRemove={removeWordCard}
              />
            </div>
          );
        })}
      </div>
      {/* btn-newcard */}
      <div className={c("btn-new-card")}>
        <FontAwesomeIcon icon={faGear} />
      </div>
      <Button label="Thêm thẻ" onClick={addWordCard} />
    </div>
  );
}
