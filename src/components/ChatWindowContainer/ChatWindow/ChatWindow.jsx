// ChatWindow.jsx – giữ nguyên hoàn toàn logic cũ của bạn
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ChatWindow.module.css";
import classNames from "classnames/bind";
import {
  faClose,
  faPhone,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import MessageItem from "./component/MessageItem";
import { Image } from "@assets/images";

const c = classNames.bind(styles);

function ChatWindow({
  sender,
  receiver,
  sendMessageChat,
  chatMessages,
  onClose,
  fetchMessagesById,
}) {
  const [messageContent, setMessageContent] = useState("");
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const fetch = async () => {
      try {
        await fetchMessagesById(receiver.id);
      } catch (error) {}
    };
    fetch();
  }, []);

  const canSend = messageContent.trim().length > 0;

  return (
    <div className={c("chatWindow")}>
      {/* Header – đẹp hơn */}
      <div className={c("chatHeader")}>
        <Image
          src={receiver.avatar}
          size="40px"
          isCircled={true}
          className={c("headerAvatar")}
        />
        <div className={c("headerInfo")}>
          <div className={c("name")}>{receiver.fullName}</div>
          <div className={c("status")}>Đang hoạt động</div>
        </div>
        <div className={c("headerActions")}>
          <div className={c("iconBtn")}>
            <FontAwesomeIcon icon={faPhone} />
          </div>
          <div
            className={c("iconBtn", "close")}
            onClick={() => onClose(receiver)}
          >
            <FontAwesomeIcon icon={faClose} />
          </div>
        </div>
      </div>

      {/* Body – giữ nguyên hoàn toàn logic render MessageItem */}
      <div className={c("chatBody")} ref={chatBodyRef}>
        {chatMessages[receiver.id]?.map((data, i) => {
          let showAvatar = true;
          let isMe = false;

          if (data.senderId === sender.id) {
            showAvatar = false;
            isMe = true;
          }
          if (i < chatMessages[receiver.id].length - 1) {
            const nextMsg = chatMessages[receiver.id][i + 1];
            if (nextMsg.senderId === data.senderId) {
              showAvatar = false;
            }
          }

          return (
            <MessageItem
              key={i}
              content={data.messageContent}
              src={receiver.avatar}
              showAvatar={showAvatar}
              isMe={isMe}
            />
          );
        })}
      </div>

      {/* Input – đẹp + có hiệu ứng gửi khi có nội dung */}
      <div className={c("chatInput")}>
        <input
          placeholder="Aa"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) {
                sendMessageChat(receiver, sender, messageContent);
                setMessageContent("");
              }
            }
          }}
        />
        <div
          className={c("sendBtn", { active: canSend })}
          onClick={() => {
            if (canSend) {
              sendMessageChat(receiver, sender, messageContent);
              setMessageContent("");
            }
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
