import styles from "./TitleSection.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function TitleSection({ title = "", onTop = false, style = {}, children }) {
  return (
    <div
      className={c(
        "titleSection",
        "d-flex",
        "align-items-center",
        "justify-content-between",
        onTop && "mt-3"
      )}
      style={style}
    >
      <div className={c("title", "font-medium")}>{title}</div>

      <div className={c("button")}>{children}</div>
    </div>
  );
}

export default TitleSection;
