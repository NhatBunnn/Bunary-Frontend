import WebSocketProvider from "./WebSocketProvider";
import NotificationProvider from "./NotificationProvider";
import UserProvider from "./UserProvider";
import ChatWindowProvider from "./ChatWindowProvider";
import WordSetListProvider from "./WordSetListProvider";
import UserListProvider from "./UserListProvider";
import AccessTokenProvider from "./AccessTokenProvider";
import CreateCollectionProvider from "./CreateCollectionProvider";

function GlobalProfiders({ children }) {
  return (
    <AccessTokenProvider>
      <NotificationProvider>
        <WebSocketProvider>
          <ChatWindowProvider>
            <WordSetListProvider>
              <UserListProvider>
                <CreateCollectionProvider>
                  <UserProvider>{children}</UserProvider>
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
