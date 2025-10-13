import { refreshAccessToken } from "@api/authApi";
import Loading from "@components/Loading";
import { parseJwt } from "@service/apiService";
import { createContext, useContext, useEffect } from "react";

const AuthContext = createContext(null);
export const useAuth = useContext(AuthContext);

function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState(null);

  const [loadingToken, setLoadingToken] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const initToken = async () => {
      setLoadingToken(true);
      setLoadingUser(true);

      let dataResponse;
      try {
        const accessToken = sessionStorage.getItem("access_token");
        if (!accessToken) {
          dataResponse = await refreshAccessToken();
        } else {
          const decodedToken = parseJwt(accessToken);
          const expiresAt = decodedToken?.exp * 1000;

          if (expiresAt && new Date().getTime() < expiresAt) {
            setAccessToken(accessToken);
            // thiếu fetch user
          } else {
            dataResponse = await refreshAccessToken();
          }
        }

        if (dataResponse) {
          sessionStorage.setItem("access_token", dataResponse.data.accessToken);
          setUser(dataResponse.data.user);
          setAccessToken(dataResponse.data.accessToken);
        }
      } catch (error) {
        console.error(error.errorStatus || error);
      } finally {
        setLoadingToken(false);
        setLoadingUser(false);
      }
    };

    initToken();
  }, []);

  // Login
  const login = async (email, password) => {};

  // Register

  // Logout

  // Verify email

  if (loadingToken) {
    return <Loading />;
  }

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
