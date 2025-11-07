import { useContext, useEffect, useState } from "react";
import { useWebsocket } from "../../context/WebSocketProvider";
import { useChatReceiver } from "@context/ChatReceiverContext";
import { useUser } from "@context/UserProvider/UserProvider";
function useChatWindow() {
  const { sendMessageChat, chatMessages, setChatMessages } = useWebsocket();

  const [messageContent, setMessageContent] = useState();
  const [loading, setLoading] = useState(false);

  const { receiver } = useChatReceiver();
  const { user } = useUser();

  return {
    sendMessageChat,
    messageContent,
    setMessageContent,
    chatMessages,
    loading,
    receiver,
    user,
  };
}

export default useChatWindow;
