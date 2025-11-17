import BadgeIconWrapper from "@components/wrapper/BadgeIconWrapper";
import styles from "./Notify.module.css";
import { bindClass } from "@utils/classnames";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWebsocket } from "@context/WebSocketProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const c = bindClass(styles);

function Notify() {
  const { notifications } = useWebsocket();

  const [openDropDown, setOpenDropDown] = useState(false);

  const navigate = useNavigate();

  const dropDownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setOpenDropDown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleToggleDropDown = () => {
    setOpenDropDown((prev) => !prev);
  };

  const handleClickNotification = (notification) => {
    switch (notification.targetType) {
      case "wordset":
        navigate(`/wordset/${notification.targetId}/a`);
        break;
      default:
        navigate("/");
    }
  };

  return (
    <BadgeIconWrapper count={notifications.length}>
      <div
        className={c("notify")}
        onClick={handleToggleDropDown}
        ref={dropDownRef}
      >
        <FontAwesomeIcon icon={faBell} />
        {openDropDown && (
          <div className={c("drop-down")}>
            {notifications?.map((notification, index) => (
              <div
                className={c("notify-item")}
                onClick={() => handleClickNotification(notification)}
              >
                <div className={c("avatar")}>
                  <img
                    src={notification?.fromUser?.avatar}
                    alt="Bún Bò Huế"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div className={c("info")}>
                  <div className={c("title")}>
                    <strong>{notification?.fromUser?.fullName} :</strong>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: notification?.message || "",
                      }}
                    ></span>
                  </div>

                  <div className={c("time")}>2025-11-17</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BadgeIconWrapper>
  );
}

export default Notify;
