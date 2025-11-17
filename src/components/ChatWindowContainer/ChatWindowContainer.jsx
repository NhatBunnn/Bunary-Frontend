import { useChatWindow } from "@context/ChatWindowProvider";
import { useUser } from "@context/UserProvider/UserProvider";
import { useWebsocket } from "@context/WebSocketProvider";
import { Fragment } from "react";
import ChatWindow from "./ChatWindow/ChatWindow";

function ChatWindowContainer() {
  const { openReceivers, openChatWindow, closeChatWindow } = useChatWindow();
  const { sendMessageChat, chatMessages } = useWebsocket();
  const { user } = useUser();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 20,
        display: "flex",
        gap: 8,
        zIndex: "100",
      }}
    >
      {openReceivers?.map((receiver, index) => (
        <ChatWindow
          onClose={closeChatWindow}
          sender={user}
          receiver={receiver}
          sendMessageChat={sendMessageChat}
          chatMessages={chatMessages}
        />
      ))}
    </div>
  );
}

export default ChatWindowContainer;
