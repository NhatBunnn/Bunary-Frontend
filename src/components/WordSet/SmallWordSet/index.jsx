import { Images } from "@assets/images";
import styles from "./SmallWordSet.module.css";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

const c = classNames.bind(styles);

function SmallWordSet({ wordSet }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(
          `/wordset/${wordSet.id}/${wordSet.title
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
      )}
    >
      <div className={c("thumbnail")}>
        <img src={wordSet.thumbnail || Images.Logo} alt="" />
      </div>
      <div className={c("content")}>
        <div className={c("title", "fw-semibold")}>
          {wordSet.title || "no title"}
        </div>
        <div className={c("detail", "d-xl-flex")}>
          <span>147 từ vựng</span>
          <span className="d-none d-xl-block"> - </span>
          <span>{wordSet.description || "no desc"}</span>
        </div>
      </div>
    </div>
  );
}

export default SmallWordSet;
