import { createContext, useState } from "react";
import AddToCollectionProvider from "./AddToCollectionProvider";
import DeleteConfirmationProvider from "./ConfirmDialogProvider";
import ChatWindowToggleProvider from "./ChatWindowToggleProvider";

export const UIContext = createContext(null);

function UIProvider({ children }) {
  // const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  return (
    <UIContext.Provider value={{}}>
      <DeleteConfirmationProvider>
        <ChatWindowToggleProvider>
          <AddToCollectionProvider>{children}</AddToCollectionProvider>
        </ChatWindowToggleProvider>
      </DeleteConfirmationProvider>
    </UIContext.Provider>
  );
}

export default UIProvider;
