// src/contexts/ChatReceiverContext.js
import { createContext, useContext, useState } from "react";

const ChatReceiverContext = createContext();

export const useChatReceiver = () => useContext(ChatReceiverContext);

export function ChatReceiverProvider({ children }) {
  const [receiver, setReceiver] = useState(null);

  return (
    <ChatReceiverContext.Provider value={{ receiver, setReceiver }}>
      {children}
    </ChatReceiverContext.Provider>
  );
}
