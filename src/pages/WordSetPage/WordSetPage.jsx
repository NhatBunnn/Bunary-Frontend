import { useEffect, useState } from "react";
import {
  faBookmark,
  faUsers,
  faEllipsisVertical,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Star } from "lucide-react"; // chỉ dùng Star
import styles from "./WordSetPage.module.css";
import classNames from "classnames/bind";
import useWordSetPage from "./useWordSetPage";
import Loading from "@components/Loading/Loading";
import { DialogWrapper } from "@components/index";
import FlashCardSetting from "./dialogs/FlashCardSetting/FlashCardSetting";
import TitleSection from "@components/TitleSection";
import Button from "@components/Button/Button";
import { useNavigate } from "react-router-dom";
import { AddToCollection } from "@features/collection/components";

const c = classNames.bind(styles);

const WordSetPage = () => {
  // Toggle UI
  const [openSetting, setOpenSetting] = useState({ flashCard: false });
  const [openMoreOptions, setMoreOptions] = useState(false);
  const [openAddToCollect, setOpenAddToCollect] = useState(false);

  // Data
  const {
    words,
    wordSet,
    loadingWords,
    rating,
    setRating,
    ratingList,
    handleFindAllWordSet,
    handleRemoveWordSet,
    handleRatingWordSet,
  } = useWordSetPage();

  const [hoverRating, setHoverRating] = useState(0);

  const navigation = useNavigate();

  if (loadingWords || !wordSet) {
    return <Loading />;
  }

  return (
    <div className={c("container")}>
      {/* Dialog */}

      <AddToCollection
        isOpen={openAddToCollect}
        onCancel={() => setOpenAddToCollect(false)}
        wordSet={wordSet}
      />
      <DialogWrapper
        onClose={() =>
          setOpenSetting((prev) => ({ ...prev, flashCard: false }))
        }
        isOpen={openSetting.flashCard}
        title="Cài đặt thẻ ghi nhớ"
      >
        <FlashCardSetting wordSetId={wordSet.id} />
      </DialogWrapper>
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
        <div className={c("moreOptions", "d-inline")}>
          <Button
            icon={faEllipsisVertical}
            onClick={() => setMoreOptions((prev) => !prev)}
          />
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
            </div>
          )}
        </div>
      </TitleSection>

      {/* info */}
      <div className={c("header")}>
        <div>
          <div className={c("stats")}>
            <div>
              <FontAwesomeIcon icon={faUsers} /> {wordSet.stat.studyCount} người
              đã học
            </div>
            <div>⭐ {wordSet.stat.ratingAvg} / 5 (10 reviews)</div>
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
        </div>
      </div>

      {/* Main Grid */}
      <div className={c("mainGrid")}>
        <div className={c("thumbnail")}>
          <img
            src={wordSet?.thumbnail}
            alt={wordSet?.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>

        <div className={c("wordGrid")}>
          {words.map((word, idx) => (
            <div key={idx} className={c("wordCard")}>
              <div className={c("wordCardLeft")}>
                <img
                  src={word?.thumbnail}
                  alt={word?.term}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div className={c("wordCardRight")}>
                <div>
                  <strong>{word?.term}</strong> ({word?.partOfSpeech})
                </div>
                <div>/{word.ipa}/</div>
                <div>{word.meaning}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={c("separator")} />

      {/* Author Section */}
      <div className={c("authorSection")}>
        <div className={c("avatar")}>
          <img
            src={wordSet.author?.avatar}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <div>
          <div
            style={{ fontSize: "0.875rem", color: "#555", marginBottom: "4px" }}
          >
            Created by{" "}
            <strong> {wordSet.author?.fullName || "Unknown Author"}</strong>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#888" }}>
            Updated 2 weeks ago
          </div>
        </div>
      </div>

      <div className={c("separator")} />

      {/* Rating & Review */}
      <div style={{ padding: "24px 0" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          Rate this word set
        </h2>

        {/* Lucide Stars */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= (hoverRating || rating.value);
              return (
                <div
                  key={star}
                  onClick={(e) =>
                    setRating((prev) => ({ ...prev, value: star }))
                  }
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    transform: filled ? "scale(1.3)" : "scale(1)",
                  }}
                >
                  <Star
                    size={28}
                    strokeWidth={2.5}
                    color={filled ? "#ffc107" : "#ccc"}
                    fill={filled ? "#ffc107" : "none"}
                  />
                </div>
              );
            })}
          </div>
          <span style={{ color: "#666", fontSize: "0.875rem" }}>
            {rating.value > 0
              ? `You rated ${rating.value} star${rating.value > 1 ? "s" : ""}`
              : "Click to rate"}
          </span>
        </div>

        {/* Textarea + Submit */}
        <textarea
          value={rating.comment}
          onChange={(e) =>
            setRating((prev) => ({ ...prev, comment: e.target.value }))
          }
          placeholder="Write your review here..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            resize: "none",
            fontSize: "0.9375rem",
            marginBottom: "12px",
            fontFamily: "inherit",
          }}
        />

        <button
          className={c("submitButton")}
          style={{ padding: "10px 20px" }}
          onClick={() => handleRatingWordSet()}
        >
          Submit Review
        </button>

        {/* Sample Review */}
        {ratingList?.map((rating, i) => (
          <div
            style={{ marginTop: "32px", display: "flex", gap: "12px" }}
            key={i}
          >
            <img
              src={rating.user.avatar}
              alt={rating.user.fullName}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "0.9375rem",
                  marginBottom: "4px",
                }}
              >
                {rating.user.fullName}{" "}
                <span style={{ color: "#ffc107", marginLeft: "6px" }}>
                  {[...Array(rating.value)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#333",
                  lineHeight: "1.5",
                }}
              >
                {rating.comment}
              </div>
              <div
                style={{ fontSize: "0.75rem", color: "#888", marginTop: "4px" }}
              >
                {rating.createdAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordSetPage;
