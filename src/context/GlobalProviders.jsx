import WebSocketProvider from "./WebSocketProvider";
import NotificationProvider from "./NotificationProvider";
import UserProvider from "./UserProvider";
import ChatWindowProvider from "./ChatWindowProvider";
import WordSetListProvider from "./WordSetListProvider";
import UserListProvider from "./UserListProvider";
import AccessTokenProvider from "./AccessTokenProvider";

function GlobalProfiders({ children }) {
  return (
    <AccessTokenProvider>
      <NotificationProvider>
        <WebSocketProvider>
          <ChatWindowProvider>
            <WordSetListProvider>
              <UserListProvider>
                <UserProvider>{children}</UserProvider>
              </UserListProvider>
            </WordSetListProvider>
          </ChatWindowProvider>
        </WebSocketProvider>
      </NotificationProvider>
    </AccessTokenProvider>
  );
}

export default GlobalProfiders;
