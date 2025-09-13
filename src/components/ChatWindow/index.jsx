import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ChatWindow.module.css";
import classNames from "classnames/bind";
import {
  faClose,
  faPhone,
  faPaperPlane,
  faTruckLoading,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useWebsocket } from "../../context/WebSocketProvider";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import Avatar from "../Avatar";
import MessageItem from "./component";
import { useUser } from "../../context/UserProvider";
import useChatWindow from "../../hooks/useChatWindow";
import { ChatWindowContext } from "../../context/ChatWindowProvider";

const c = classNames.bind(styles);

function ChatWindow() {
  const { user } = useUser();
  const {
    messageContent,
    setMessageContent,
    sendMessage,
    chatMessages,
    loading,
  } = useChatWindow();
  const { receiver, openChatWindow, handelToggleChatWindow } =
    useContext(ChatWindowContext);

  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages[receiver.id]]);

  return (
    openChatWindow && (
      <div className={c("chatWindow", "d-flex", "flex-column")}>
        {/* Header */}
        <div
          className={c(
            "chatHeader",
            "d-flex",
            "divider-bottom",
            "align-items-center",
            "justify-content-center"
          )}
        >
          <Avatar
            userId=""
            src={receiver.avatar}
            size="32px"
            isCircled={true}
            className={c("avatar", "me-2")}
          />
          <div className={c("info", "flex-fill")}>
            <div className={c("name")}>{receiver.fullName}</div>
            <div className={c("status")}>Đã hoạt động 17 phút trước</div>
          </div>
          <div className={c("action", "d-flex")}>
            <div className={c("call")}>
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <div
              className={c("close")}
              onClick={() => handelToggleChatWindow(false)}
            >
              <FontAwesomeIcon icon={faClose} />
            </div>
          </div>
        </div>
        {/* Body */}
        <div className={c("chatBody", "flex-fill", "px-2")} ref={chatBodyRef}>
          {loading && (
            <div className={c("loading")}>
              <div className={c("spinner-border")} role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {chatMessages[receiver.id]?.map((data, i) => {
            let showAvatar = true;
            let isMe = false;
            if (data.senderId === user.id) {
              showAvatar = false;
              isMe = true;
            }

            if (
              data.receiverId === chatMessages[receiver.id]?.[i + 1]?.receiverId
            ) {
              showAvatar = false;
            }

            return (
              <MessageItem
                content={data.messageContent}
                src={receiver.avatar}
                showAvatar={showAvatar}
                isMe={isMe}
              />
            );
          })}
        </div>
        {/* Input */}
        <div className={c("chatInput", "d-flex", "divider-top")}>
          <input
            className={c("flex-fill")}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
          <div className={c("send")} onClick={() => sendMessage()}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
        </div>
      </div>
    )
  );
}

export default ChatWindow;
