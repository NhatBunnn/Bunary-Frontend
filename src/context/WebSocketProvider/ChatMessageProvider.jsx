import { useFetcher } from "@api/fetcher";
import { useWebsocket } from "@context/WebSocketProvider/WebSocketProvider";
import useAppBase from "@hooks/useAppBase";
import { createContext, useContext, useEffect, useState } from "react";

const ChatMessageContext = createContext(null);

export const useChatMessage = () => useContext(ChatMessageContext);

function ChatMessageProvider({ children }) {
  const { stompClientRef, isConnected } = useWebsocket();

  const { setLoading, loading } = useAppBase();
  const { fetcher } = useFetcher();

  const [chatMessages, setChatMessages] = useState({});

  console.log("chatMessages", chatMessages);

  useEffect(() => {
    if (!stompClientRef?.current || !isConnected) return;

    const client = stompClientRef.current;

    const subscription = client.subscribe("/user/queue/messages", (message) => {
      const newMsg = JSON.parse(message.body);
      console.log("Nhận tin nhắn từ server:", newMsg);

      setChatMessages((prev) => ({
        ...prev,
        [newMsg.senderId]: [...(prev[newMsg.senderId] || []), newMsg],
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClientRef, isConnected]);

  const fetchMessagesById = async (receiverId) => {
    if (receiverId in chatMessages) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetcher({
        url: `/api/v1/chatmessages/${receiverId}`,
        method: "GET",
        params: {},
      });

      // sắp xếp lại để tin nhắn mới đứng ở cuối box chat và cũ  thì đứng đầu
      const sortedMessages = response.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setChatMessages({ [receiverId]: sortedMessages || [] });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageChat = (receiver, sender, messageContent) => {
    const client = stompClientRef.current;
    if (!client || !client.connected)
      return console.warn("WebSocket chưa kết nối");

    const msg = {
      senderId: sender.id,
      receiverId: receiver.id,
      messageContent,
    };

    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(msg),
    });

    setChatMessages((prev) => ({
      ...prev,
      [receiver.id]: [...(prev[receiver.id] || []), msg],
    }));
  };

  return (
    <ChatMessageContext.Provider
      value={{ chatMessages, sendMessageChat, fetchMessagesById }}
    >
      {children}
    </ChatMessageContext.Provider>
  );
}

export default ChatMessageProvider;
