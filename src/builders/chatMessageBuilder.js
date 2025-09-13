import { getCurrentUserId } from "../service/apiService";

export function buildChatMessage(receiver, content) {
  return JSON.stringify({
    type: "chatMessage",
    senderId: getCurrentUserId(),
    receiverId: receiver.id,
    messageContent: content,
    timestamp: new Date().toString(),
    status: "sent",
  });
}
