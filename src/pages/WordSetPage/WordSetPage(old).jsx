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
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@components/Button/Button";
import Word from "@components/Word";
import Loading from "@components/Loading/Loading";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWordSetPage from "./useWordSetPage";
import { ConfirmDialog, DialogWrapper } from "@components/index";
import { AddToCollection } from "@features/collection/components";
import FlashCardSetting from "./dialogs/FlashCardSetting/FlashCardSetting";
import Avatar from "@components/Avatar";

const c = classNames.bind(styles);

function WordSetPage() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const {
    words,
    wordSet,
    loadingWords,
    handleRemoveWordSet,
    handleRatingWordSet,
    ratingValue,
    setRatingValue,
  } = useWordSetPage();
  const [openSetting, setOpenSetting] = useState({ flashCard: false });
  const [openMoreOptions, setMoreOptions] = useState(false);
  const [openAddToCollect, setOpenAddToCollect] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

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
          <span>{`${wordSet.stat.studyCount} người đã học`}</span>
        </div>
        <div className={c("rating")}>
          <FontAwesomeIcon icon={faStar} />
          <span>{`${wordSet.stat.ratingAvg} / 5`}</span>
        </div>
      </div>

      {/* Action bar */}
      <div className={c("action-bar", "d-flex", "mb-3")}>
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

      {/* Wordcard */}
      <div className={c("wordcard", "mb-4")}>
        <div className="row w-100 h-100">
          <div className={c("col-12 col-md-6 col-lg-5", "thumbnail")}>
            <img src={wordSet.thumbnail} alt={wordSet.title} />
          </div>
          <div className={c("col-12 col-md-6 col-lg-7", "word-lists")}>
            <div className="row">
              {words.map((word, i) => (
                <div className="col-12 col-xl-6 px-2 mb-2" key={i}>
                  <Word word={word} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Author Section */}
      <div className={c("author-section", "mb-4")}>
        <TitleSection title="Tác giả" />
        <div className={c("author-info", "d-flex", "align-items-center")}>
          <Avatar size="40px" isCircled={true} src={wordSet.author?.avatar} />
          <div className={c("author-details")}>
            <span className={c("author-name")}>
              {wordSet.author?.fullName || "Unknown Author"}
            </span>
            <span className={c("author-bio")}>
              {wordSet.author?.email || "Không có thông tin về tác giả."}
            </span>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className={c("rating-section", "mb-4")}>
        <TitleSection title="Đánh giá" />
        <div className={c("rating-container", "p-3", "rounded")}>
          <div
            className={c(
              "rating-overview",
              "d-flex",
              "align-items-center",
              "mb-3"
            )}
          ></div>
          <div
            className={c(
              "rating-input",
              "d-flex",
              "align-items-center",
              "gap-3"
            )}
          >
            <div className={c("star-rating")}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={c("star", {
                    active: star <= (ratingValue || userRating),
                    hover: star <= hoverRating,
                  })}
                  onClick={() => setRatingValue(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <span className={c("rating-text")}>
              {userRating > 0 ? `${userRating}/5` : "Chọn số sao"}
            </span>
          </div>
          <Button
            label="Gửi đánh giá"
            className={c("submit-rating", { disabled: userRating === 0 })}
            disabled={userRating === 0}
            onClick={() => {
              handleRatingWordSet();
            }}
          />
        </div>
      </div>

      {/* Comment Section */}
      <div className={c("comment-section")}>
        <TitleSection title="Bình luận" />
        <div className={c("comment-input", "mb-3")}>
          <textarea
            placeholder="Viết bình luận của bạn..."
            className={c("comment-textarea")}
          />
          <Button label="Gửi bình luận" className={c("submit-comment")} />
        </div>
        <div className={c("comment-list")}>
          {wordSet.comments?.length > 0 ? (
            wordSet.comments.map((comment, i) => (
              <div key={i} className={c("comment-item", "d-flex", "mb-2")}>
                <FontAwesomeIcon
                  icon={faComment}
                  className={c("comment-icon")}
                />
                <div className={c("comment-content")}>
                  <span className={c("comment-author")}>{comment.author}</span>
                  <p className={c("comment-text")}>{comment.text}</p>
                  <span className={c("comment-date")}>{comment.date}</span>
                </div>
              </div>
            ))
          ) : (
            <p className={c("no-comments")}>Chưa có bình luận nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WordSetPage;
