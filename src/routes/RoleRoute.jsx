import { useUser } from "@context/UserProvider";
import { Navigate } from "react-router-dom";

function RoleRoute({ children, allowedRoles = [] }) {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;
