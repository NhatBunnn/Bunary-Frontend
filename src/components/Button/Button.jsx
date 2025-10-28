import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Button.module.css";
import classNames from "classnames/bind";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const c = classNames.bind(styles);

/**
 * @typedef {"default" | "menu" | "outline"} ButtonVariant
 */

/**
 * @param {{
 *  variant?: ButtonVariant
 * }} props
 */

function Button({
  label = "",
  icon,
  type,
  onClick,
  isLoading = false,
  to = "",
  className,
  variant = "default",
}) {
  const navigate = useNavigate();

  return (
    <div
      className={c(
        "button",
        "d-inline-flex",
        "cursor-pointer",
        "link-no-style",
        "outline-primary",
        className
      )}
      type={type}
      onClick={(e) => {
        if (to) {
          navigate(to);
        } else {
          onClick?.(e);
        }
      }}
      style={
        variant === "default"
          ? {
              borderRadius: "var(--radius-round)",
              boxShadow: "var(--box-shadow-primary)",
            }
          : {
              borderRadius: "var(--radius-small)",
              boxShadow: "none",
              border: "none",
              background: "var(--color-white)",
            }
      }
    >
      {icon && (
        <div className={c("icon")}>
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <div className={c("label")}>
        {!isLoading && label}
        {isLoading && (
          <FontAwesomeIcon icon={faSpinner} className="ms-2 fa-spin" />
        )}
      </div>
    </div>
  );
}

export default Button;
