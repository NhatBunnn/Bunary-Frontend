import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Notification.module.css";
import classNames from "classnames/bind";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNotification } from "../../context/NotificationProvider";

const c = classNames.bind(styles);

export default function Notification() {
  const { message, type = "success" } = useNotification();

  if (!message) return null;

  return (
    <div className={c("notification", type, "active")}>
      <div className={c("icon")}>
        <FontAwesomeIcon icon={type === "success" ? faCheck : faXmark} />
      </div>
      <span className={c("message")}>{message}</span>
    </div>
  );
}
