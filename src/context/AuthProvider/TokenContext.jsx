import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import { API_URL } from "@config/apiConfig";
import Loading from "@components/Loading/Loading";
import { decodeJWT } from "@service/jwtService";

const TokenContext = createContext(null);

export const useToken = () => useContext(TokenContext);

function TokenProvider({ children }) {
  const tokenRef = useRef(null);
  const [loading, setLoading] = useState(true);

  async function getToken() {
    let token = tokenRef.current;

    if (token) {
      let base64Url = token.split(".")[1];
      let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      let jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      const expiresAt = decoded?.exp * 1000;

      if (expiresAt && new Date().getTime() < expiresAt) {
        return token;
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh-Token`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const newToken = data.data.accessToken;
        tokenRef.current = newToken;

        return newToken;
      } else {
        console.log("Không lấy được Token");
      }
    } catch (error) {
      console.log(error.message);
    }

    return;
  }

  function setToken(token) {
    tokenRef.current = token;
  }

  useEffect(() => {
    const init = async () => {
      try {
        const response = await getToken();

        console.log("response ", response);
      } catch (err) {
        console.error("Error initializing token:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  async function getRoles() {
    const token = await getToken();
    if (!token) return [];

    const decoded = decodeJWT(token);
    return decoded?.roles || [];
  }

  async function getScope() {
    const token = await getToken();
    if (!token) return "";

    const decoded = decodeJWT(token);
    return decoded?.scope || "";
  }

  const value = useMemo(() => ({ getToken, setToken, getRoles }), []);

  if (loading) {
    return <Loading />;
  }

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
}

export default TokenProvider;
