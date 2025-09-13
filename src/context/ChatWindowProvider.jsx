import { createContext, useState } from "react";

export const ChatWindowContext = createContext(null);

function ChatWindowProvider({ children }) {
  const [receiver, setReceiver] = useState({});
  const [openChatWindow, setOpenChatWindow] = useState(false);

  const handelToggleChatWindow = (status) => {
    status ? setOpenChatWindow(true) : setOpenChatWindow(false);
  };

  return (
    <ChatWindowContext.Provider
      value={{
        receiver,
        setReceiver,
        openChatWindow,
        handelToggleChatWindow,
      }}
    >
      {children}
    </ChatWindowContext.Provider>
  );
}

export default ChatWindowProvider;
