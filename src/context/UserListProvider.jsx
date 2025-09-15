import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config/apiConfig";
import { useAccessToken } from "./AccessTokenProvider";
const UserListContext = createContext();
export const useUserList = () => useContext(UserListContext);

function UserListProvider({ children }) {
  const [loadingUserList, setLoadingUserList] = useState(true);
  const { loadingToken, accessToken } = useAccessToken();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      setLoadingUserList(true);

      try {
        if (!accessToken || loadingToken) return;

        const response = await fetch(`${API_URL}/api/v1/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        const dataResponse = await response.json();

        if (dataResponse.statusCode >= 200 && dataResponse.statusCode < 300) {
          setUsers(dataResponse.data);
        } else {
          console.log(dataResponse.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingUserList(false);
      }
    };

    getAllUsers();
  }, [accessToken, loadingToken]);

  return (
    <UserListContext.Provider value={{ users, loadingUserList }}>
      {children}
    </UserListContext.Provider>
  );
}

export default UserListProvider;
