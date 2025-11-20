import { createContext, useContext, useEffect, useState } from "react";
import { useWebsocket } from "./WebSocketProvider";

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

function NotificationProvider({ children }) {
  const { stompClientRef, isConnected } = useWebsocket();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const client = stompClientRef.current;
    if (!client || !isConnected) return;

    const subscription = client.subscribe(
      "/user/queue/notifications",
      (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prev) => [notification, ...prev]);
      }
    );

    return () => subscription.unsubscribe();
  }, [stompClientRef, isConnected]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
