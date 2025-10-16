import { useToken } from "@context/AuthProvider/TokenContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

function PrivateRoute({ children }) {
  const { getToken } = useToken();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToken() {
      const t = await getToken();
      setToken(t);
      setLoading(false);
    }
    fetchToken();
  }, [getToken]);

  if (loading) return <div>Loading...</div>;

  return token ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
