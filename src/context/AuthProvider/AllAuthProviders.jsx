import TokenProvider from "./TokenContext";

function AllAuthProviders({ children }) {
  return <TokenProvider>{children}</TokenProvider>;
}

export default AllAuthProviders;
