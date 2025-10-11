import { useAccessToken } from "@context/AccessTokenProvider";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { accessToken } = useAccessToken();

  return accessToken ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
