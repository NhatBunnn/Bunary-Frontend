import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TitleSection from "../../components/TitleSection";
import styles from "./WordSetPage.module.css";
import classNames from "classnames/bind";
import {
  faBookmark,
  faEllipsisVertical,
  faStar,
  faChartColumn,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import Word from "../../components/Word";
import Loading from "../../components/Loading";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWordSetPage from "./useWordSetPage";
import { ConfirmDialog, DialogWrapper } from "@components/index";
import { AddToCollection } from "@features/collection/components";
import FlashCardSetting from "./dialogs/FlashCardSetting/FlashCardSetting";

const c = classNames.bind(styles);

function WordSetPage() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { words, wordSet, loadingWords, handleRemoveWordSet } =
    useWordSetPage();
  const [openSetting, setOpenSetting] = useState({ flashCard: false });
  const [openMoreOptions, setMoreOptions] = useState(false);

  const [openAddToCollect, setOpenAddToCollect] = useState(false);

  const moreOptionsRef = useRef();
  const navigation = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(e.target)
      ) {
        setMoreOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleSetting = (type) => {
    setOpenSetting((prev) => (prev === type ? "" : type));
  };

  const handleToggleMoreOptions = () => {
    setMoreOptions((prev) => !prev);
  };

  if (loadingWords || !wordSet) {
    return <Loading />;
  }

  return (
    <div className={c("wordSetPage")}>
      {/* Dialog: AddToCollection */}
      <AddToCollection
        isOpen={openAddToCollect}
        onCancel={() => setOpenAddToCollect(false)}
        wordSet={wordSet}
      />
      {/* Dialog: Remove Wordset */}
      <ConfirmDialog
        isOpen={openConfirmDialog}
        onCancel={() => setOpenConfirmDialog(false)}
        onConfirm={() => handleRemoveWordSet()}
      />

      {/* Dialog: Setting */}
      {openSetting.flashCard !== "" && (
        <DialogWrapper
          onClose={() =>
            setOpenSetting((prev) => ({ ...prev, flashCard: false }))
          }
          isOpen={openSetting.flashCard}
          title="Cài đặt thẻ ghi nhớ"
        >
          <FlashCardSetting wordSetId={wordSet.id} />
        </DialogWrapper>
      )}

      {/* Title */}
      <TitleSection
        title={wordSet.title}
        onTop={true}
        style={{ marginBottom: "8px" }}
      >
        <Button
          label="Lưu"
          icon={faBookmark}
          onClick={() => {
            setOpenAddToCollect(true);
            // setWordSet(wordSet);
          }}
        />
        <div className={c("moreOptions", "d-inline")} ref={moreOptionsRef}>
          <Button icon={faEllipsisVertical} onClick={handleToggleMoreOptions} />
          {openMoreOptions && (
            <div className={c("dropdown", "p-3", "gap-2")}>
              <Button
                variant="menu"
                label="Chỉnh sửa"
                onClick={(e) => {
                  e.stopPropagation();
                  navigation(`/wordset/${wordSet.id}/edit`);
                }}
              />
              <Button
                variant="menu"
                label="Xóa"
                onClick={() => setOpenConfirmDialog(true)}
              />
            </div>
          )}
        </div>
      </TitleSection>

      <div className={c("desc", "mb-2")}>{wordSet.description}</div>

      <div className={c("info", "d-flex", "align-items-center", "mb-3")}>
        <div className={c("learners-count")}>
          <FontAwesomeIcon icon={faChartColumn} />
          <span>12 người đã học</span>
        </div>
        <div className={c("rating")}>
          <FontAwesomeIcon icon={faStar} />
          <span>9.7</span>
        </div>
      </div>

      {/* action bar */}
      <div className={c("action-bar", "f-flex", "mb-3")}>
        <Button
          label="Thẻ ghi nhớ"
          icon={faIdCard}
          onClick={() =>
            setOpenSetting((prev) => ({ ...prev, flashCard: true }))
          }
        />
        <Button label="Trắc nghiệm" icon={faIdCard} />
        <Button label="Kiểm tra" icon={faIdCard} />
      </div>

      {/* wordcard */}
      <div className={c("wordcard", "d-flex", "justify-content-between")}>
        <div className="row">
          <div className={c("col-12 col-sm-4", "h-100", "thumil")}>
            <div className={c("thumbnail")}>
              <img src={wordSet.thumbnail} alt="" />
            </div>
          </div>
          <div className={c("col", "h-100")}>
            <div className={c("word-lists")}>
              <div className="row">
                {words.map((word, i) => (
                  <div className="col-12 col-md-6 px-2" key={i}>
                    <Word word={word} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* author (làm sau) */}
    </div>
  );
}

export default WordSetPage;
