import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: "",
    type: "success",
    active: false,
  });

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type, active: true });

    setTimeout(() => {
      setNotification({ message: "", type: "success", active: false });
    }, 5000);
  }, []);

  return (
    <NotificationContext.Provider value={{ ...notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
