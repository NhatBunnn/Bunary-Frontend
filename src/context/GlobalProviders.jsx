import NotificationProvider from "./NotificationProvider";
import CreateCollectionProvider from "./CreateCollectionProvider";
import UIProvider from "./UIContext/UIProvider";
import AllAuthProviders from "./AuthProvider/AllAuthProviders";
import UserProviderWrapper from "./UserProvider/UserProviderWrapper";
import { WebSocketProvider } from "./WebSocketProvider";
import ChatWindowProvider from "./ChatWindowProvider";

function GlobalProfiders({ children }) {
  return (
    <NotificationProvider>
      <AllAuthProviders>
        <ChatWindowProvider>
          <UserProviderWrapper>
            <WebSocketProvider>
              <CreateCollectionProvider>
                <UIProvider>{children}</UIProvider>
              </CreateCollectionProvider>
            </WebSocketProvider>
          </UserProviderWrapper>
        </ChatWindowProvider>
      </AllAuthProviders>
    </NotificationProvider>
  );
}

export default GlobalProfiders;
