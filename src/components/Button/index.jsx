import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Button.module.css";
import classNames from "classnames/bind";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const c = classNames.bind(styles);

function Button({
  label = "",
  icon,
  type,
  onClick,
  isLoading = false,
  to = "",
  className,
}) {
  const navigate = useNavigate();

  return (
    <button
      className={c(
        "button",
        "d-inline-flex",
        "cursor-pointer",
        "link-no-style",
        className
      )}
      type={type}
      onClick={() => (to ? navigate(to) : onClick?.())}
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
    </button>
  );
}

export default Button;
