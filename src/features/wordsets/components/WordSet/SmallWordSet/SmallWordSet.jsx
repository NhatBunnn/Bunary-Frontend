import { useContext } from "react";
import styles from "./SmallWordSet.module.css";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { Images } from "@assets/images";

const c = classNames.bind(styles);

function SmallWordSet({ wordSet, style }) {
  const navigate = useNavigate();

  return (
    <div
      style={style}
      onClick={() =>
        navigate(
          `/wordset/${wordSet?.id}/${wordSet?.title
            .split(" ")
            .filter(Boolean)
            .map((d) => d.toLowerCase())
            .join("-")}`
        )
      }
      className={c(
        "smallWordSet",
        "d-flex",
        "justify-content-left",
        "align-items-center"
        // "outline-primary"
      )}
    >
      <div className={c("thumbnail")}>
        <img src={wordSet?.thumbnail || Images.Logo} alt="" />
      </div>
      <div className={c("content")}>
        <div className={c("title", "font-medium")}>
          {wordSet?.title || "no title"}
        </div>
        <div className={c("detail", "d-xl-flex")}>
          <span className={c("wordCount")}>147 từ vựng</span>
          <span className={c("separator")}> - </span>
          <span className={c("description")}>
            {wordSet?.description || "Không có mô tả"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SmallWordSet;
