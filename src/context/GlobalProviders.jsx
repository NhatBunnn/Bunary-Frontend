import NotificationProvider from "./NotificationProvider";
import CreateCollectionProvider from "./CreateCollectionProvider";
import UIProvider from "./UIContext/UIProvider";
import AllAuthProviders from "./AuthProvider/AllAuthProviders";
import UserProviderWrapper from "./UserProvider/UserProviderWrapper";
import { WebSocketProvider } from "./WebSocketProvider";
import { ChatReceiverProvider } from "./ChatReceiverContext";

function GlobalProfiders({ children }) {
  return (
    <NotificationProvider>
      <AllAuthProviders>
        <UserProviderWrapper>
          <WebSocketProvider>
            <CreateCollectionProvider>
              <ChatReceiverProvider>
                <UIProvider>{children}</UIProvider>
              </ChatReceiverProvider>
            </CreateCollectionProvider>
          </WebSocketProvider>
        </UserProviderWrapper>
      </AllAuthProviders>
    </NotificationProvider>
  );
}

export default GlobalProfiders;
