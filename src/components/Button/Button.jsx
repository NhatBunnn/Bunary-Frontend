import styles from "./Button.module.css";
import classNames from "classnames/bind";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const c = classNames.bind(styles);

/**
 * @typedef {"default" | "menu" | "outline" | "plain"} ButtonVariant
 */

/**
 * startIcon, endIcon, icon có thể là FontAwesomeIcon, Lucide icon, hoặc bất cứ ReactNode nào
 */
function Button({
  label = "",
  icon,       // ReactNode
  startIcon,  // ReactNode
  endIcon,    // ReactNode
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

  return (
    <button
      className={c("button", variant, className)}
      type={type}
      onClick={handleClick}
      disabled={isLoading}
    >
      {startIcon && <div className={c("icon")}>{startIcon}</div>}
      {!isLoading && icon && <div className={c("icon")}>{icon}</div>}

      <span className={c("label")}>
        {!isLoading && label}
        {isLoading && <FontAwesomeIcon icon={faSpinner} className="fa-spin" />}
      </span>

      {endIcon && <div className={c("icon")}>{endIcon}</div>}
    </button>
  );
}

export default Button;
