import { Children, createContext, useState } from "react";

export const CreateCollectContext = createContext(null);

function CreateCollectionProvider({ children }) {
  const [openCreateCollect, setOpenCreateCollect] = useState(false);

  const handleToggleCreateCollect = (status) => {
    status ? setOpenCreateCollect(true) : setOpenCreateCollect(false);
  };

  return (
    <CreateCollectContext.Provider
      value={{ openCreateCollect, handleToggleCreateCollect }}
    >
      {children}
    </CreateCollectContext.Provider>
  );
}

export default CreateCollectionProvider;
