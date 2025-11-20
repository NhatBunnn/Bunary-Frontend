import { useChatWindow } from "@context/ChatWindowProvider";
import { useUser } from "@context/UserProvider/UserProvider";
import ChatWindow from "./ChatWindow/ChatWindow";
import { useChatMessage } from "@context/WebSocketProvider/ChatMessageProvider";

function ChatWindowContainer() {
  const { openReceivers, closeChatWindow } = useChatWindow();
  const { sendMessageChat, chatMessages, fetchMessagesById } = useChatMessage();
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
          key={index}
          onClose={closeChatWindow}
          sender={user}
          receiver={receiver}
          sendMessageChat={sendMessageChat}
          chatMessages={chatMessages}
          fetchMessagesById={fetchMessagesById}
        />
      ))}
    </div>
  );
}

export default ChatWindowContainer;
