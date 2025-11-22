import { useToken } from "@context/AuthProvider/TokenContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function GuestRoute({ children }) {
  const { getToken } = useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    async function fetchToken() {
      const token = await getToken();
      if (token) {
        setIsGuest(false);
        navigate("/");
      } else {
        setIsGuest(true);
      }
      setLoading(false);
    }
    fetchToken();
  }, [getToken, navigate]);

  if (loading) {
    return null;
  }

  return isGuest ? <>{children}</> : null;
}

export default GuestRoute;
