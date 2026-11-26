import styles from "./SmallWordSet.module.css";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { Image, Images } from "@assets/images";

const c = classNames.bind(styles);

function SmallWordSet({ loading, wordSet, style }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className={c("smallWordSet", "shimmer")} style={style}>
        <div className={c("thumbnail")}>
          <img src={wordSet?.thumbnail || Images.Logo} alt="" />
        </div>
        <div className={c("content")}>
          <div className={c("shimmer-line", "title")} />
          <div className={c("shimmer-line", "desc")} />
        </div>
      </div>
    );
  }

  const slug = wordSet?.title
    ? wordSet.title
        .split(" ")
        .filter(Boolean)
        .map((d) => d.toLowerCase())
        .join("-")
    : "";

  const wordCount = wordSet?.stat?.wordCount ?? 0;

  return (
    <div
      style={style}
      onClick={() => navigate(`/wordset/${wordSet?.id}/${slug}`)}
      className={c("smallWordSet")}
    >
      <div className={c("thumbnail")}>
        <Image
          src={wordSet?.thumbnail}
          fallback={Images.flashCardNoImageSmall}
          alt={wordSet?.title || "WordSet thumbnail"}
          width="100%"
          height="100%"
        />
      </div>
      <div className={c("content")}>
        <div className={c("title")} title={wordSet?.title}>
          {wordSet?.title || "Chưa có tiêu đề"}
        </div>
        <div className={c("detail")}>
          <span className={c("wordCount")}>{wordCount} từ vựng</span>
          <span className={c("separator")}>•</span>
          <span className={c("description")}>
            {wordSet?.description || "Không có mô tả"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SmallWordSet;
