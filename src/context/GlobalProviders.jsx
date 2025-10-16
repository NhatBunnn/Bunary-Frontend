import WebSocketProvider from "./WebSocketProvider";
import NotificationProvider from "./NotificationProvider";
import ChatWindowProvider from "./ChatWindowProvider";
import WordSetListProvider from "./WordSetListProvider";
import AccessTokenProvider from "./AccessTokenProvider";
import CreateCollectionProvider from "./CreateCollectionProvider";
import UIProvider from "./UIContext/UIProvider";
import AllAuthProviders from "./AuthProvider/AllAuthProviders";
import AllUserProviders from "./UserProvider/AllUserProvider";

function GlobalProfiders({ children }) {
  return (
    <NotificationProvider>
      <AllAuthProviders>
        <AccessTokenProvider>
          <WebSocketProvider>
            <ChatWindowProvider>
              <WordSetListProvider>
                <CreateCollectionProvider>
                  <UIProvider>
                    <AllUserProviders>{children}</AllUserProviders>
                  </UIProvider>
                </CreateCollectionProvider>
              </WordSetListProvider>
            </ChatWindowProvider>
          </WebSocketProvider>
        </AccessTokenProvider>
      </AllAuthProviders>
    </NotificationProvider>
  );
}

export default GlobalProfiders;
