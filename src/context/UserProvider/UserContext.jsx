import { findMyAccount } from "@api/userApi";
import { useToken } from "@context/AuthProvider/TokenContext";
import useAppBase from "@hooks/useAppBase";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

function UserProvider({ children }) {
  const { setLoading, loading } = useAppBase();
  const { getToken } = useToken();

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await findMyAccount(await getToken());
        setUser(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
