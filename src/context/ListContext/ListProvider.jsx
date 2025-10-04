import { createContext } from "react";
import MyCollectionProvider from "./MyCollectionProvider";

export const ListContext = createContext(null);

function ListProvider({ children }) {
  return (
    <MyCollectionProvider>
      <ListContext.Provider>{children}</ListContext.Provider>
    </MyCollectionProvider>
  );
}

export default ListProvider;
