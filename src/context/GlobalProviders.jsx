import WebSocketProvider from "./WebSocketProvider";
import NotificationProvider from "./NotificationProvider";
import UserProvider from "./UserProvider";
import ChatWindowProvider from "./ChatWindowProvider";
import WordSetListProvider from "./WordSetListProvider";
import UserListProvider from "./UserListProvider";
import AccessTokenProvider from "./AccessTokenProvider";
import CreateCollectionProvider from "./CreateCollectionProvider";
import CollectionListProvider from "./ListContext/CollectionListProvider";
import UIProvider from "./UIContext/UIProvider";
import ListProvider from "./ListContext/ListProvider";

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
                      <ListProvider>
                        <UserProvider>{children}</UserProvider>
                      </ListProvider>
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
