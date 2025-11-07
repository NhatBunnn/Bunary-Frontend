import { Children, createContext, useContext, useState } from "react";

const ChatWindowContext = createContext(null);

export const useChatWindowToggle = () => useContext(ChatWindowContext);

function ChatWindowToggleProvider({ children }) {
  const [isOpenChat, setIsOpenChat] = useState(false);

  const handelToggleChatWindow = (status) => {
    status ? setIsOpenChat(true) : setIsOpenChat(false);
  };

  return (
    <ChatWindowContext.Provider value={{ isOpenChat, handelToggleChatWindow }}>
      {children}
    </ChatWindowContext.Provider>
  );
}

export default ChatWindowToggleProvider;
