import { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken } from "../service/apiService";
import Loading from "../components/Loading";

const AccessTokenContext = createContext(null);

export const useAccessToken = () => useContext(AccessTokenContext);

function AccessTokenProvider({ children }) {
  const [loadingToken, setLoadingToken] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  console.log("accessToken ", accessToken);

  useEffect(() => {
    const initToken = async () => {
      setLoadingToken(true);
      try {
        const token = await getAccessToken();
        setAccessToken(token || "");
      } catch (err) {
        console.error("Lấy token thất bại", err);
        setAccessToken("");
      } finally {
        setLoadingToken(false);
      }
    };

    initToken();
  }, [accessToken]);

  if (loadingToken) {
    return <Loading />;
  }

  return (
    <AccessTokenContext.Provider
      value={{ loadingToken, accessToken, setAccessToken }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
}

export default AccessTokenProvider;
