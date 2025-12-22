import BadgeIconWrapper from "@components/wrapper/BadgeIconWrapper";
import styles from "./Notify.module.css";
import { bindClass } from "@utils/classnames";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNotification } from "@context/WebSocketProvider/NotificationProvider";

const c = bindClass(styles);

function Notify() {
  const { notifications, unReadCount, markAllNotificationsAsRead } =
    useNotification();

  const [openDropDown, setOpenDropDown] = useState(false);
  const navigate = useNavigate();
  const dropDownRef = useRef(null);

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
    setOpenDropDown((prev) => {
      if (!prev) {
        markAllNotificationsAsRead();
      }
      return !prev;
    });
  };

  const handleClickNotification = (notification) => {
    setOpenDropDown(false);

    switch (notification.targetType) {
      case "wordset":
        navigate(`/wordset/${notification.targetId}/a`);
        break;
      case "FRIENDSHIP":
        navigate(`/u/${notification.targetId}`);
        break;
      default:
        navigate("/");
    }
  };

  const handleViewMore = () => {
    setOpenDropDown(false);
    navigate("/notifications");
  };

  return (
    <BadgeIconWrapper count={unReadCount}>
      <div
        className={c("notify")}
        onClick={handleToggleDropDown}
        ref={dropDownRef}
      >
        <FontAwesomeIcon icon={faBell} />

        {openDropDown && (
          <div className={c("drop-down")}>
            {/* header */}
            <div className={c("drop-down-header")}>Thông báo</div>

            {/* body */}
            <div className={c("drop-down-body")}>
              {notifications?.length > 0 ? (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={c("notify-item")}
                    onClick={() => handleClickNotification(notification)}
                  >
                    <div className={c("avatar")}>
                      <img src={notification?.actor?.avatar} alt="avatar" />
                    </div>

                    <div className={c("info")}>
                      <div className={c("title")}>
                        <strong>{notification?.actor?.fullName}:</strong>{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: notification?.message || "",
                          }}
                        />
                      </div>
                      <div className={c("time")}>{notification?.createdAt}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={c("empty")}>Không có thông báo</div>
              )}
            </div>

            {/* footer */}
            <div className={c("drop-down-footer")} onClick={handleViewMore}>
              Xem thêm
            </div>
          </div>
        )}
      </div>
    </BadgeIconWrapper>
  );
}

export default Notify;
