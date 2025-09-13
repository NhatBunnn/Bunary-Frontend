import { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [active, setActive] = useState(false);

  const showNotification = (message, type = "success") => {
    setMessage(message);
    setType(type);
    setActive(true);

    setTimeout(() => {
      setActive(false);
      setMessage("");
      setType("");
    }, 5000);
  };

  return (
    <NotificationContext.Provider
      value={{ message, type, active, showNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
