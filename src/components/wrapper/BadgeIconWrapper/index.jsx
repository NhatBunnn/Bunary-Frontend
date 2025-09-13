import { useWebsocket } from "../../../context/WebSocketProvider";
import styles from "./BadgeIconWrapper.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function BadgeIconWrapper({ children }) {
  const { notification, setNotification } = useWebsocket();

  return (
    <div className={c("badgeIconWrapper")}>
      {notification.length > 0 && (
        <div className={c("icon")}>{notification.length}</div>
      )}
      {children}
    </div>
  );
}

export default BadgeIconWrapper;
