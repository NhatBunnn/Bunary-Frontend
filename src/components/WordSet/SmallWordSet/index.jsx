import styles from "./SmallWordSet.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function SmallWordSet() {
  return (
    <div
      className={c(
        "smallWordSet",
        "d-flex",
        "justify-content-left",
        "align-items-center"
      )}
    >
      <div className={c("thumbnail")}>
        <img
          src="https://wallpapers.com/images/hd/cheems-z7bq2c62esomoun6.jpg"
          alt=""
        />
      </div>
      <div className={c("content")}>
        <div className={c("title", "fw-semibold")}>dsadsad</div>
        <div className={c("detail", "d-xl-flex")}>
          <span>147 từ vựng</span>
          <span className="d-none d-xl-block"> - </span>
          <span>Pdsad</span>
        </div>
      </div>
    </div>
  );
}

export default SmallWordSet;
