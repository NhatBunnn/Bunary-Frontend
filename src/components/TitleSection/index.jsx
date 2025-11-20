import styles from "./TitleSection.module.css";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const c = classNames.bind(styles);

function TitleSection({
  title = "",
  subtitle = "",
  onTop = false,
  style = {},
  icon = null, // có thể là string (URL) hoặc icon object của FontAwesome
  children,
}) {
  // Kiểm tra nếu icon là object FontAwesome
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "string") {
      // URL ảnh
      return <img src={icon} alt="icon" className={c("icon")} />;
    } else if (typeof icon === "object") {
      // FontAwesome icon object
      return <FontAwesomeIcon icon={icon} className={c("iconComponent")} />;
    } else {
      return icon; // fallback nếu là component khác
    }
  };

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
      <div className={c("d-flex", "align-items-center", "gap-3")}>
        {icon && <div className={c("iconWrapper")}>{renderIcon()}</div>}

        <div>
          <div className={c("title", "font-medium")}>{title}</div>
          {subtitle && <div className={c("subtitle")}>{subtitle}</div>}
        </div>
      </div>

      <div className={c("button")}>{children}</div>
    </div>
  );
}

export default TitleSection;
