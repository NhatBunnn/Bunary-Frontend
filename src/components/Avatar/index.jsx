import { useEffect, useState } from "react";
import { useWebsocket } from "../../context/WebSocketProvider";
import styles from "./Avatar.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function Avatar({
  onClick,
  isCircled,
  size,
  src,
  alt = "",
  width,
  height,
  style,
  className,
  userId,
  ...props
}) {
  const { onlineUsers = [] } = useWebsocket();

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (onlineUsers.includes(userId)) {
      setIsOnline(true);
    } else {
      setIsOnline(false);
    }
  }, [onlineUsers, userId]);

  return (
    <div className={c("avatar")}>
      <div
        onClick={onClick}
        className={c("content", className)}
        style={{
          width: width || size,
          height: height || size,
          ...style,
          borderRadius: isCircled ? "100px" : "",
        }}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      {isOnline && <div className={c("userStatus")}></div>}
    </div>
  );
}

export default Avatar;
