import { createContext, useContext, useEffect, useState } from "react";
import { WEBSOCKET_URL } from "../config/apiConfig";
import { useToken } from "./AuthProvider/TokenContext";
import { useUser } from "./UserProvider/UserContext";

const WebSocketContext = createContext(null);

export const useWebsocket = () => useContext(WebSocketContext);

function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [notification, setNotification] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { getToken } = useToken();
  const { user } = useUser();

  useEffect(() => {
    let ws = null;

    const createWebSocket = async () => {
      try {
        ws = new WebSocket(
          `${WEBSOCKET_URL}/ws?accessToken=${await getToken()}`
        );

        ws.onopen = () => {
          console.log("Connected to the server.");
        };

        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);

          switch (data.type) {
            case "chatMessage":
              setChatMessages((prev) => ({
                ...prev,
                [data.senderId]: [...(prev[data.senderId] || []), data],
              }));
              break;
            case "notification":
              setNotification((prev) => [...prev, data]);
              break;
            case "onlineUsers":
              setOnlineUsers(data.users);
              break;
            default:
              console.error("bủn lmao");
          }
        };
      } catch (error) {
        console.error("Lỗi khi tạo WebSocket:", error);
      }

      ws.onclose = () => console.log("WebSocket closed");
      ws.onerror = (err) => console.error("WebSocket error:", err);

      setSocket(ws);
    };

    createWebSocket();

    return () => {
      if (ws && ws.readyState !== WebSocket.CLOSED) {
        ws.close();
      }
    };
  }, []);

  const sendMessageChat = (receiver, content) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not ready");
      return;
    }

    let msg = {
      type: "chatMessage",
      senderId: user.id,
      receiverId: receiver.id,
      messageContent: content,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    socket.send(JSON.stringify(msg));

    setChatMessages((prev) => ({
      ...prev,
      [receiver.id]: [...(prev[receiver.id] || []), msg],
    }));
  };

  const updateChatWindowStatus = (status = false, receiver) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not ready");
      return;
    }

    const chatWindowStatus = {
      type: "chatWindowStatus",
      receiverId: receiver,
      isOpen: status,
      isNotify: false,
    };

    socket.send(JSON.stringify(chatWindowStatus));
  };

  return (
    <WebSocketContext.Provider
      value={{
        setChatMessages,
        chatMessages,
        sendMessageChat,
        updateChatWindowStatus,
        notification,
        setNotification,
        onlineUsers,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export default WebSocketProvider;
