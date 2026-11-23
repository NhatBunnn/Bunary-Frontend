import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

function UserProvider({ children }) {
  const { setLoading, loading } = useAppBase();
  const { fetcher } = useFetcher();
  const [user, setUser] = useState({});

  const refetchUser = async () => {
    try {
      const response = await fetcher({
        url: `/api/v1/users/me`,
        method: "GET",
      });
      if (response && response.data) {
        setUser(response.data);
        return response.data;
      }
    } catch (e) {
      console.error("Lỗi khi tải thông tin người dùng:", e);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      setLoading(true);
      try {
        const response = await fetcher({
          url: `/api/v1/users/me`,
          method: "GET",
        });
        if (isMounted && response?.data) {
          setUser(response.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetch();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
