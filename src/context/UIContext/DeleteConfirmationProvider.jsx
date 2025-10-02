import { Children, createContext, useRef, useState } from "react";

export const DeleteConfirmContext = createContext(null);

function DeleteConfirmationProvider({ children }) {
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState(null);

  // Xem lại về cách react xử lý bất đồng bộ

  const onConfirmRef = useRef(null);

  const openDeleteConfirm = (callbackObject) => {
    onConfirmRef.current = callbackObject.onConfirm;
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setOnConfirmCallback(null);
    setDeleteConfirmOpen(false);
  };

  const confirmDelete = () => {
    if (onConfirmRef.current) onConfirmRef.current();
    setDeleteConfirmOpen(false);
  };

  return (
    <DeleteConfirmContext.Provider
      value={{
        isDeleteConfirmOpen,
        openDeleteConfirm,
        closeDeleteConfirm,
        confirmDelete,
      }}
    >
      {children}
    </DeleteConfirmContext.Provider>
  );
}

export default DeleteConfirmationProvider;
