import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Button.module.css";
import classNames from "classnames/bind";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const c = classNames.bind(styles);

/**
 * @typedef {"default" | "menu" | "outline" | "plain"} ButtonVariant
 */

function Button({
  label = "",
  icon,
  startIcon,
  endIcon,
  type = "button",
  onClick,
  isLoading = false,
  to = "",
  className,
  variant = "default",
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (to) {
      navigate(to);
    } else {
      onClick?.(e);
    }
  };

  // switch-case style theo variant
  let style = {};
  switch (variant) {
    case "default":
      style = {
        borderRadius: "var(--radius-round)",
        boxShadow: "var(--box-shadow-primary)",
      };
      break;
    case "menu":
      style = {
        borderRadius: "var(--radius-small)",
        boxShadow: "none",
        border: "none",
        background: "transparent",
      };
      break;
    case "outline":
      style = {
        borderRadius: "var(--radius-small)",
        boxShadow: "none",
        border: "1px solid var(--color-primary)",
        background: "transparent",
      };
      break;
    case "plain":
      style = {
        borderRadius: "var(--radius-round)",
      };
      break;
    default:
      style = {};
  }

  const showIcon = variant !== "plain"; // ẩn icon nếu plain

  return (
    <div
      className={c(
        "button",
        "d-inline-flex",
        "align-center",
        "cursor-pointer",
        className
      )}
      type={type}
      onClick={handleClick}
      style={style}
    >
      {icon && (
        <div className={c("icon")}>
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      {startIcon && (
        <div className={c("icon")}>
          <FontAwesomeIcon icon={startIcon} />
        </div>
      )}
      <div className={c("label")}>
        {!isLoading && label}
        {isLoading && (
          <FontAwesomeIcon icon={faSpinner} className="ms-2 fa-spin" />
        )}
      </div>
      {endIcon && (
        <div className={c("icon", "ms-1")}>
          <FontAwesomeIcon icon={endIcon} />
        </div>
      )}
    </div>
  );
}

export default Button;
