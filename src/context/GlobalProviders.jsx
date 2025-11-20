import NotificationProvider from "./NotificationProvider";
import CreateCollectionProvider from "./CreateCollectionProvider";
import UIProvider from "./UIContext/UIProvider";
import AllAuthProviders from "./AuthProvider/AllAuthProviders";
import UserProviderWrapper from "./UserProvider/UserProviderWrapper";
import { WebSocketProvider } from "./WebSocketProvider/WebSocketProvider";
import ChatWindowProvider from "./ChatWindowProvider";
import WebSocketProviderWrapper from "./WebSocketProvider/WebSocketProviderWrapper";

function GlobalProfiders({ children }) {
  return (
    <NotificationProvider>
      <AllAuthProviders>
        <WebSocketProviderWrapper>
          <ChatWindowProvider>
            <UserProviderWrapper>
              <WebSocketProvider>
                <CreateCollectionProvider>
                  <UIProvider>{children}</UIProvider>
                </CreateCollectionProvider>
              </WebSocketProvider>
            </UserProviderWrapper>
          </ChatWindowProvider>
        </WebSocketProviderWrapper>
      </AllAuthProviders>
    </NotificationProvider>
  );
}

export default GlobalProfiders;
