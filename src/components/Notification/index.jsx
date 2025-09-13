import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Notification.module.css";
import classNames from "classnames/bind";
import {
  faCircleCheck,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNotification } from "../../context/NotificationProvider";

const c = classNames.bind(styles);

function Notification() {
  const { message, type = "success" } = useNotification();
  return (
    <>
      <div
        className={c(
          "notification",
          "d-flex",
          `${message !== "" ? `active` : ``}`
        )}
        style={{
          border:
            type !== "success" ? "1px solid #ff0000" : "1px solid #2ec862",
        }}
      >
        {type === "success" ? (
          <div className={c("icon", "me-2")}>
            <FontAwesomeIcon icon={faCircleCheck} />
          </div>
        ) : (
          <div
            className={c("icon", "me-2")}
            style={{ color: "#ff0000", backgroundColor: "#ff00001e" }}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </div>
        )}

        {message}
      </div>
    </>
  );
}

export default Notification;
