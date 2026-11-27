import classNames from "classnames/bind";
import { Image } from "@assets/images";
import styles from "./UserAvatar.module.css";

const c = classNames.bind(styles);

function UserAvatar({
  src,
  alt = "Avatar",
  frame,
  size = 44,
  status,
  showFrame = true,
  borderColor = "#ffffff",
  className,
  imgClassName,
}) {
  const statusSize = Math.max(10, Math.round(size * 0.28));
  const statusBorder = Math.max(2, Math.round(size * 0.06));

  return (
    <div
      className={c("avatarRoot", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        className={c("avatarImg", imgClassName)}
        style={{ borderColor }}
      />

      {showFrame && frame && (
        <span className={c("frameRing", frame)} aria-hidden="true" />
      )}

      {status === "online" && (
        <span
          className={c("statusDot")}
          style={{
            width: statusSize,
            height: statusSize,
            borderWidth: statusBorder,
            borderColor,
          }}
          aria-label="Online"
        />
      )}
    </div>
  );
}

export default UserAvatar;
