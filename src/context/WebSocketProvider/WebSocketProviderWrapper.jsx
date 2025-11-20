import ChatMessageProvider from "./ChatMessageProvider";
import NotificationProvider from "./NotificationProvider";
import { WebSocketProvider } from "./WebSocketProvider";

function WebSocketProviderWrapper({ children }) {
  return (
    <WebSocketProvider>
      <NotificationProvider>
        <ChatMessageProvider>{children}</ChatMessageProvider>
      </NotificationProvider>
    </WebSocketProvider>
  );
}

export default WebSocketProviderWrapper;
