import { createContext, useContext, useState } from "react";

const ChatWindowContext = createContext();

export const useChatWindow = () => useContext(ChatWindowContext);

function ChatWindowProvider({ children }) {
  const [openReceivers, setOpenReceivers] = useState([]);

  console.log("openReceivers", openReceivers);

  const openChatWindow = (receiver) => {
    setOpenReceivers((prev) => {
      // if it's already open then keep it unchanged
      if (prev.includes(receiver)) return;

      if (prev.length < 3) {
        return [...prev, receiver];
      }

      if (prev.length === 3) {
        return [...prev.slice(1), receiver];
      }
    });
  };

  const closeChatWindow = (receiver) => {
    setOpenReceivers((prev) => prev.filter((r) => r !== receiver));
  };

  return (
    <ChatWindowContext.Provider
      value={{ openReceivers, openChatWindow, closeChatWindow }}
    >
      {children}
    </ChatWindowContext.Provider>
  );
}

export default ChatWindowProvider;
