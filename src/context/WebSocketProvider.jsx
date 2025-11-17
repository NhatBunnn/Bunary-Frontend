import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useToken } from "./AuthProvider/TokenContext";

const WebSocketContext = createContext(null);
export const useWebsocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [chatMessages, setChatMessages] = useState({});
  const [notifications, setNotifications] = useState([]);

  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef(null);
  const { getToken } = useToken();

  useEffect(() => {
    let client = null;

    const connect = async () => {
      const token = await getToken();
      if (!token) {
        console.error("Không có token để kết nối WebSocket");
        return;
      }

      const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);

      client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log("[STOMP]", str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = (frame) => {
        setIsConnected(true);
        stompClientRef.current = client;

        client.subscribe("/user/queue/messages", (message) => {
          const curMessage = JSON.parse(message.body);

          setChatMessages((prev) => ({
            ...prev,
            [curMessage.senderId]: [
              ...(prev[curMessage.senderId] || []),
              curMessage,
            ],
          }));
        });

        // Subscribe notification riêng
        client.subscribe("/user/queue/notifications", (message) => {
          const notification = JSON.parse(message.body);

          setNotifications((prev) => [notification, ...prev]);
        });
      };

      client.onStompError = (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        console.error("Body:", frame.body);
        setIsConnected(false);
      };

      client.onDisconnect = () => {
        console.log(" WebSocket disconnected");
        setIsConnected(false);
      };

      client.activate();
    };

    connect();

    return () => {
      if (client && client.active) {
        console.log("Disconnecting WebSocket...");
        client.deactivate();
      }
    };
  }, [getToken]);

  const sendMessageChat = (receiver, sender, messageContent) => {
    const client = stompClientRef.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
      return;
    }

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
    <WebSocketContext.Provider
      value={{
        chatMessages,
        sendMessageChat,
        notifications,
        isConnected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
