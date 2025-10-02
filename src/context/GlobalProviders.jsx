import WebSocketProvider from "./WebSocketProvider";
import NotificationProvider from "./NotificationProvider";
import UserProvider from "./UserProvider";
import ChatWindowProvider from "./ChatWindowProvider";
import WordSetListProvider from "./WordSetListProvider";
import UserListProvider from "./UserListProvider";
import AccessTokenProvider from "./AccessTokenProvider";
import CreateCollectionProvider from "./CreateCollectionProvider";
import CollectionListProvider from "./CollectionListProvider";
import UIProvider from "./UIContext/UIProvider";

function GlobalProfiders({ children }) {
  return (
    <AccessTokenProvider>
      <NotificationProvider>
        <WebSocketProvider>
          <ChatWindowProvider>
            <WordSetListProvider>
              <UserListProvider>
                <CollectionListProvider>
                  <CreateCollectionProvider>
                    <UIProvider>
                      <UserProvider>{children}</UserProvider>
                    </UIProvider>
                  </CreateCollectionProvider>
                </CollectionListProvider>
              </UserListProvider>
            </WordSetListProvider>
          </ChatWindowProvider>
        </WebSocketProvider>
      </NotificationProvider>
    </AccessTokenProvider>
  );
}

export default GlobalProfiders;
