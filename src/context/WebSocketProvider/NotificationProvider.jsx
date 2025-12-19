import { createContext, useContext, useEffect, useState } from "react";
import { useWebsocket } from "./WebSocketProvider";
import useAppBase from "@hooks/useAppBase";
import { useFetcher } from "@api/fetcher";

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

function NotificationProvider({ children }) {
  const { stompClientRef, isConnected } = useWebsocket();
  const { loading, setLoading, te, showNotification } = useAppBase();
  const { fetcher } = useFetcher();

  const [notifications, setNotifications] = useState([]);
  const [unReadCount, setUnReadCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await fetcher({
          url: "/api/v1/notifications/me",
          method: "GET",
          params: {
            page: 0,
            size: 5,
            sort: "id,desc",
          },
        });

        setNotifications(response?.data?.notification);
        setUnReadCount(response?.data?.unReadCount);
      } catch (e) {
        showNotification(te(e.errorCode), "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const client = stompClientRef.current;
    if (!client || !isConnected) return;

    const subscription = client.subscribe(
      "/user/queue/notifications",
      (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prev) => [notification, ...prev]);
        setUnReadCount((prev) => prev + 1);
      }
    );

    return () => subscription.unsubscribe();
  }, [stompClientRef, isConnected]);

  const markAllNotificationsAsRead = async () => {
    try {
      await fetcher({
        url: "/api/v1/notifications/read-all",
        method: "POST",
      });

      setUnReadCount(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unReadCount, markAllNotificationsAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
