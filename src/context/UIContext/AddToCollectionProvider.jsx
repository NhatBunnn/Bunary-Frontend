import { createContext, useState } from "react";

export const AddToCollectionContext = createContext(null);

function AddToCollectionProvider({ children }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [wordSet, setWordSet] = useState(null);

  return (
    <AddToCollectionContext.Provider
      value={{ setOpenDialog, openDialog, wordSet, setWordSet }}
    >
      {children}
    </AddToCollectionContext.Provider>
  );
}

export default AddToCollectionProvider;
