import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./MenuItem.module.css";
import classNames from "classnames/bind";
import { useContext } from "react";
import { LowerTablet } from "../../../../DefaultLayout";
import { Link } from "react-router-dom";

const c = classNames.bind(styles);

function MenuItem({ icon, label, to }) {
  const lowerTablet = useContext(LowerTablet);

  return (
    <Link
      to={to}
      className={c("menuItem", "d-flex", "align-items-center", "link-no-style")}
    >
      <div className={c("content", "d-flex", "align-items-center")}>
        <div className={c("icon", `${lowerTablet ? "" : "icon-mr"}`)}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div
          className={c(
            "label",
            `${lowerTablet ? "d-block" : "d-none d-xxl-block"}`
          )}
        >
          {label}
        </div>
      </div>
    </Link>
  );
}

export default MenuItem;
