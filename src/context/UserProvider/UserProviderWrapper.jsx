import UserProvider from "./UserProvider";

function UserProviderWrapper({ children }) {
  return <UserProvider>{children}</UserProvider>;
}

export default UserProviderWrapper;
