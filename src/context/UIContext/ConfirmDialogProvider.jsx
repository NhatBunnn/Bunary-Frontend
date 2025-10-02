import { Children, createContext, useRef, useState } from "react";

export const ConfirmDialogContext = createContext(null);

function ConfirmDialogProvider({ children }) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [message, setMessage] = useState("");

  const handleOpenConfirm = ({ message, onConfirm }) => {
    setMessage(message);
    // Xem lại phần: Callback
    setConfirmCallback(() => onConfirm);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => setConfirmOpen(false);

  const handleConfirm = () => {
    confirmCallback();
    setConfirmOpen(false);
  };

  return (
    <ConfirmDialogContext.Provider
      value={{
        handleOpenConfirm,
        handleCloseConfirm,
        handleConfirm,
        isConfirmOpen,
        message,
      }}
    >
      {children}
    </ConfirmDialogContext.Provider>
  );
}

export default ConfirmDialogProvider;
