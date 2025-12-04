import styles from "./Button.module.css";
import classNames from "classnames/bind";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    if (to) navigate(to);
    else onClick?.(e);
  };

  // style theo variant
  const styleMap = {
    default: {
      borderRadius: "var(--radius-round)",
      background: "var(--color-primary)",
      color: "#fff",
    },
    menu: {
      borderRadius: "var(--radius-small)",
      boxShadow: "none",
      border: "none",
      background: "transparent",
    },
    outline: {
      borderRadius: "var(--radius-round)",
      color: "var(--color-primary-solid)",
      border: "1px solid var(--color-primary-solid)",
      background: "transparent",
    },
    plain: {
      borderRadius: "var(--radius-round)",
    },
  };

  const style = styleMap[variant] || {};

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
      {!isLoading && icon && <div className={c("icon")}>{icon}</div>}
      {startIcon && <div className={c("icon")}>{startIcon}</div>}

      <div className={c("label")}>
        {!isLoading && label}
        {isLoading && (
          <FontAwesomeIcon icon={faSpinner} className="ms-2 fa-spin" />
        )}
      </div>

      {endIcon && <div className={c("icon", "ms-1")}>{endIcon}</div>}
    </div>
  );
}

export default Button;
