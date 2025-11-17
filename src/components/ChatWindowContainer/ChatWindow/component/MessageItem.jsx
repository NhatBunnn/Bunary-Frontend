import { Image } from "@assets/images";
import styles from "./MessageItem.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function MessageItem({ content, isMe, src, showAvatar = true }) {
  return (
    <div
      className={c(
        "messageItem",
        "d-flex",
        "align-items-center",
        isMe ? "justify-content-end" : ""
      )}
    >
      <Image
        src={src}
        size="30px"
        isCircled={true}
        className={c("avatar", "me-2", showAvatar ? "" : "invisible")}
      />
      <div className={c("message")}>{content}</div>
    </div>
  );
}

export default MessageItem;
