import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Images } from "@assets/images";
import styles from "./LargeWordSet.module.css";
import classNames from "classnames/bind";
import { faStar, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ProfileHoverCard from "@components/ProfileHoverCard/ProfileHoverCard";
import UserAvatar from "@components/UserAvatar/UserAvatar";
import { useEquippedCosmetics } from "@utils/cosmetics";

const c = classNames.bind(styles);

function LargeWordSet({ author, wordSet }) {
  const authorCosmetics = useEquippedCosmetics(author);
  const slug = wordSet?.title
    ? wordSet.title
        .split(" ")
        .filter(Boolean)
        .map((d) => d.toLowerCase())
        .join("-")
    : "";

  const ratingAvg = wordSet?.stat?.ratingAvg ?? 0;
  const wordCount = wordSet?.stat?.wordCount ?? 0;

  return (
    <Link
      className={c("largeWordSet", "link-no-style")}
      to={`/wordset/${wordSet?.id}/${slug}`}
    >
      {/* Left: Thumbnail */}
      <div className={c("thumbnail")}>
        {ratingAvg > 0 && (
          <div className={c("rating")}>
            <FontAwesomeIcon icon={faStar} className={c("rating__icon")} />
            <span>{Number(ratingAvg).toFixed(1)}</span>
          </div>
        )}
        <Image
          src={wordSet?.thumbnail}
          fallback={Images.flashCardNoImageLarge}
          alt={wordSet?.title || "WordSet thumbnail"}
          width="100%"
          height="100%"
        />
      </div>

      {/* Right: Content */}
      <div className={c("content")}>
        <div className={c("head")}>
          <div className={c("title")} title={wordSet?.title}>
            {wordSet?.title}
          </div>

          <div className={c("badges")}>
            <span className={c("vocab")}>
              <FontAwesomeIcon icon={faBookOpen} className={c("vocab__icon")} />
              {wordCount} từ vựng
            </span>
            {wordSet?.level && (
              <span className={c("level-tag")}>{wordSet.level}</span>
            )}
          </div>
        </div>

        <p className={c("description")}>
          {wordSet?.description || "Chưa có mô tả cho bộ từ vựng này."}
        </p>

        {author && (
          <ProfileHoverCard user={author}>
            <div
              className={c("author")}
              onClick={(e) => e.stopPropagation()}
            >
              <UserAvatar
                src={author.avatar || Images.Logo}
                alt={author.fullName}
                frame={authorCosmetics.avatarFrame}
                size={24}
              />
              <span
                className={c("authorName")}
                style={
                  authorCosmetics.nameColor
                    ? { color: authorCosmetics.nameColor, fontWeight: 700 }
                    : undefined
                }
              >
                {author.fullName}
              </span>
            </div>
          </ProfileHoverCard>
        )}
      </div>
    </Link>
  );
}

export default LargeWordSet;
