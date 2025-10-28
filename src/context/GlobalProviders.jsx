import WebSocketProvider from "./WebSocketProvider";
import NotificationProvider from "./NotificationProvider";
import ChatWindowProvider from "./ChatWindowProvider";
import CreateCollectionProvider from "./CreateCollectionProvider";
import UIProvider from "./UIContext/UIProvider";
import AllAuthProviders from "./AuthProvider/AllAuthProviders";
import AllUserProviders from "./UserProvider/AllUserProvider";

function GlobalProfiders({ children }) {
  return (
    <NotificationProvider>
      <AllAuthProviders>
        <AllUserProviders>
          <WebSocketProvider>
            <ChatWindowProvider>
              <CreateCollectionProvider>
                <UIProvider>{children}</UIProvider>
              </CreateCollectionProvider>
            </ChatWindowProvider>
          </WebSocketProvider>
        </AllUserProviders>
      </AllAuthProviders>
    </NotificationProvider>
  );
}

export default GlobalProfiders;
