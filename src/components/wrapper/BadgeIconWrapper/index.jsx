import { useWebsocket } from "../../../context/WebSocketProvider";
import styles from "./BadgeIconWrapper.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function BadgeIconWrapper({ count, children }) {
  return (
    <div className={c("badgeIconWrapper")}>
      {count > 0 && <div className={c("icon")}>{count}</div>}
      {children}
    </div>
  );
}

export default BadgeIconWrapper;
