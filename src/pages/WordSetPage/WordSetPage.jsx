import { useEffect, useState } from "react";
import {
  faBookmark,
  faUsers,
  faEllipsisVertical,
  faIdCard,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Star } from "lucide-react";
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
import { getThumbnailUrl } from "@utils/getThumbnailUrl";
import { useUser } from "@context/UserProvider/UserProvider";

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
    handleRatingWordSet,
  } = useWordSetPage();

  // current user
  const { user } = useUser();

  const [hoverRating, setHoverRating] = useState(0);

  const navigation = useNavigate();

  if (loadingWords || !wordSet) {
    return <Loading />;
  }

  const isAuthor = wordSet?.author?.id === user.id;

  return (
    <div className={c("container")}>
      {/* Dialogs */}
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

      {/* Header section with Title and Action Bar */}
      <div className={c("headerSection")}>
        <TitleSection
          title={wordSet.title}
          onTop={true}
          className={c("titleSection")}
        >
          <Button
            label="Lưu vào bộ"
            icon={<FontAwesomeIcon icon={faBookmark} />}
            onClick={() => setOpenAddToCollect(true)}
          />
          <div className={c("moreOptions", "d-inline-block")}>
            <Button
              icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
              onClick={() => setMoreOptions((prev) => !prev)}
            />
            {openMoreOptions && (
              <div className={c("dropdownWrapper")}>
                {isAuthor && (
                  <Button
                    variant="menu"
                    label="Chỉnh sửa"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigation(`/wordset/${wordSet.id}/edit`);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </TitleSection>

        <div className={c("header")}>
          <div className={c("stats")}>
            <div className={c("statItem")}>
              <FontAwesomeIcon icon={faUsers} size="sm" />
              <span>{wordSet.stat.studyCount} lượt học</span>
            </div>
            <div className={c("statItem")}>
              {wordSet?.stat?.ratingCount >= 3 ? (
                <>
                  <FontAwesomeIcon icon={faStar} color="#ffc107" size="sm" />
                  <span className={c("ratingNum")}>
                    {wordSet.stat.ratingAvg} / 5
                  </span>
                </>
              ) : (
                <span>Chưa có đánh giá</span>
              )}
              <span className={c("ratingTotal")}>
                ({wordSet?.stat?.ratingCount || 0} đánh giá)
              </span>
            </div>
          </div>

          <div className={c("actionBar")}>
            <Button
              label="Flashcards"
              icon={<FontAwesomeIcon icon={faIdCard} />}
              onClick={() =>
                setOpenSetting((prev) => ({ ...prev, flashCard: true }))
              }
            />
            <Button
              label="Trắc nghiệm"
              icon={<FontAwesomeIcon icon={faIdCard} />}
              to={`/learning/${wordSet.id}/multiple-choice`}
            />
            <Button
              label="Test"
              icon={<FontAwesomeIcon icon={faIdCard} />}
              to={`/learning/${wordSet.id}/test`}
            />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className={c("mainGrid")}>
        <div className={c("thumbnailWrapper")}>
          <img src={wordSet?.thumbnail} alt={wordSet?.title} />
        </div>

        <div className={c("wordGrid")}>
          {words.map((word, idx) => (
            <div key={idx} className={c("wordCard")}>
              <div className={c("wordImage")}>
                <img src={getThumbnailUrl(word?.thumbnail)} alt={word?.term} />
              </div>
              <div className={c("wordContent")}>
                <div className={c("wordTopLine")}>
                  <span className={c("term")}>{word?.term}</span>
                  <span className={c("pos")}>({word?.partOfSpeech})</span>
                </div>
                <div className={c("ipa")}>/{word.ipa}/</div>
                <div className={c("meaning")}>{word.meaning}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={c("divider")} />

      {/* Author Details */}
      <div className={c("authorCard")}>
        <img
          src={wordSet.author?.avatar}
          alt={wordSet.author?.fullName}
          className={c("authorAvatar")}
        />
        <div className={c("authorBio")}>
          <span className={c("authorLabel")}>Tác giả</span>
          <span className={c("authorName")}>
            {wordSet.author?.fullName || "Bunary User"}
          </span>
        </div>
      </div>

      <div className={c("divider")} />

      {/* Rating System */}
      <div className={c("ratingContainer")}>
        <h2 className={c("sectionTitle")}>Đánh giá bộ từ vựng</h2>

        <div className={c("ratingInput")}>
          <div className={c("starsRow")}>
            <div className={c("starGroup")}>
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hoverRating || rating.value);
                return (
                  <button
                    key={star}
                    className={c("starBtn")}
                    onClick={() =>
                      setRating((prev) => ({ ...prev, value: star }))
                    }
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={24}
                      strokeWidth={filled ? 0 : 2}
                      color={filled ? "#ffc107" : "#cbd5e1"}
                      fill={filled ? "#ffc107" : "none"}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            value={rating.comment}
            onChange={(e) =>
              setRating((prev) => ({ ...prev, comment: e.target.value }))
            }
            placeholder="Chia sẻ cảm nghĩ của bạn về bộ từ này..."
            className={c("reviewTextarea")}
          />

          <button className={c("submitBtn")} onClick={handleRatingWordSet}>
            Gửi nhận xét
          </button>
        </div>

        {/* User Reviews */}
        <div className={c("reviewList")}>
          {ratingList?.map((item, i) => (
            <div className={c("reviewItem")} key={i}>
              <img
                src={item.user.avatar}
                alt={item.user.fullName}
                className={c("reviewerImg")}
              />
              <div className={c("reviewBody")}>
                <div className={c("reviewHead")}>
                  <span className={c("reviewerName")}>
                    {item.user.fullName}
                  </span>
                  <div className={c("starsDisplay")}>
                    {"★".repeat(item.value)}
                    {"☆".repeat(5 - item.value)}
                  </div>
                </div>
                <p className={c("reviewText")}>{item.comment}</p>
                <div className={c("reviewDate")}>{item.createdAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordSetPage;
