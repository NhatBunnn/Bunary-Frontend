import WebSocketProvider from "./WebSocketProvider";
import NotificationProvider from "./NotificationProvider";
import UserProvider from "./UserProvider";
import ChatWindowProvider from "./ChatWindowProvider";
import WordSetListProvider from "./WordSetListProvider";
import UserListProvider from "./UserListProvider";
import AccessTokenProvider from "./AccessTokenProvider";
import CreateCollectionProvider from "./CreateCollectionProvider";
import AddToCollectionProvider from "./AddToCollectionProvider";
import CollectionListProvider from "./CollectionListProvider";

function GlobalProfiders({ children }) {
  return (
    <AccessTokenProvider>
      <NotificationProvider>
        <WebSocketProvider>
          <ChatWindowProvider>
            <WordSetListProvider>
              <UserListProvider>
                <CreateCollectionProvider>
                  <AddToCollectionProvider>
                    <CollectionListProvider>
                      <UserProvider>{children}</UserProvider>
                    </CollectionListProvider>
                  </AddToCollectionProvider>
                </CreateCollectionProvider>
              </UserListProvider>
            </WordSetListProvider>
          </ChatWindowProvider>
        </WebSocketProvider>
      </NotificationProvider>
    </AccessTokenProvider>
  );
}

export default GlobalProfiders;
