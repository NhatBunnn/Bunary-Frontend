import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUserId } from "../service/apiService";
import { API_URL } from "../config/apiConfig";
import { useAccessToken } from "./AccessTokenProvider";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

function UserProvider({ children }) {
  const [user, setUser] = useState();
  const [loadingUser, setLoadingUser] = useState(true);

  const { loadingToken, accessToken } = useAccessToken();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!accessToken || loadingToken) return;

        const response = await fetch(
          `${API_URL}/api/v1/users/${getCurrentUserId()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          }
        );

        const dataResponse = await response.json();

        if (dataResponse.statusCode >= 200 && dataResponse.statusCode < 300) {
          setUser(dataResponse.data);
        } else {
          console.log(dataResponse.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [accessToken, loadingToken]);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
