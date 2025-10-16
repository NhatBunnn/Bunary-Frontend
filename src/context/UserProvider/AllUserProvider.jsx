import UserProvider from "./UserContext";

function AllUserProviders({ children }) {
  return <UserProvider>{children}</UserProvider>;
}

export default AllUserProviders;
