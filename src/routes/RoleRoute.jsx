import Loading from "@components/Loading";
import { useUser } from "@context/UserProvider/UserContext";
import { Navigate } from "react-router-dom";

function RoleRoute({ children, allowedRoles = [] }) {
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return <Loading />;
  }

  console.log("user ", user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.roles.some((role) => allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;
