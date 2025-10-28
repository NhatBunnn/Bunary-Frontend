import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import Loading from "@components/Loading";
import { parseJwt } from "@api/apiService";
import { refreshAccessToken } from "@api/authApi";

const TokenContext = createContext(null);

export const useToken = () => useContext(TokenContext);

function TokenProvider({ children }) {
  const tokenRef = useRef(null);
  const [loading, setLoading] = useState(true);

  async function getToken() {
    let accessToken = tokenRef.current;

    if (accessToken) {
      const decoded = parseJwt(accessToken);
      const expiresAt = decoded?.exp * 1000;

      if (expiresAt && new Date().getTime() < expiresAt) {
        return accessToken;
      }
    }

    const response = await refreshAccessToken();
    const newToken = response.data.accessToken;
    tokenRef.current = newToken;
    return newToken;
  }

  useEffect(() => {
    const init = async () => {
      try {
        await getToken();
      } catch (err) {
        console.error("Error initializing token:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const value = useMemo(() => ({ getToken }), []);

  if (loading) {
    return <Loading />;
  }

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
}

export default TokenProvider;
