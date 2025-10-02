import { createContext, useState } from "react";
import AddToCollectionProvider from "./AddToCollectionProvider";
import DeleteConfirmationProvider from "./DeleteConfirmationProvider";

export const UIContext = createContext(null);

function UIProvider({ children }) {
  // const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  return (
    <UIContext.Provider value={{}}>
      <DeleteConfirmationProvider>
        <AddToCollectionProvider>{children}</AddToCollectionProvider>
      </DeleteConfirmationProvider>
    </UIContext.Provider>
  );
}

export default UIProvider;
