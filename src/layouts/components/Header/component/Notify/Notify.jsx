import BadgeIconWrapper from "@components/wrapper/BadgeIconWrapper";
import styles from "./Notify.module.css";
import { bindClass } from "@utils/classnames";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const c = bindClass(styles);

function Notify() {
  return (
    <BadgeIconWrapper>
      <div className={c("notify")}>
        <FontAwesomeIcon icon={faBell} />
      </div>
    </BadgeIconWrapper>
  );
}

export default Notify;
