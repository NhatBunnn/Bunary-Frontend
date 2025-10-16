import { useContext, useEffect, useState } from "react";
import { ChatWindowContext } from "../../context/ChatWindowProvider";
import { getAccessToken } from "../../service/apiService";
import { useWebsocket } from "../../context/WebSocketProvider";
import { API_URL } from "../../config/apiConfig";
function useChatWindow() {
  const { receiver } = useContext(ChatWindowContext);
  const { sendMessageChat, chatMessages, setChatMessages } = useWebsocket();

  const [messageContent, setMessageContent] = useState();
  const [loading, setLoading] = useState(false);

  const sendMessage = () => {
    sendMessageChat(receiver, messageContent);
  };

  useEffect(() => {
    if (!receiver?.id) {
      return;
    }

    const getChatMessages = async () => {
      setLoading(true);

      try {
        const token = await getAccessToken();

        const response = await fetch(
          `${API_URL}/api/v1/chatmessages/${receiver.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        const dataResponse = await response.json();

        if (dataResponse.statusCode >= 200 && dataResponse.statusCode < 300) {
          console.log("receiver.id ", dataResponse.data);
          setChatMessages((prev) => ({
            ...prev,
            [receiver.id]: [...dataResponse.data, ...(prev[receiver.id] || [])],
          }));
        } else {
          console.log(dataResponse.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getChatMessages();
  }, [receiver, setChatMessages]);
  return {
    messageContent,
    setMessageContent,
    sendMessage,
    chatMessages,
    loading,
  };
}

export default useChatWindow;
