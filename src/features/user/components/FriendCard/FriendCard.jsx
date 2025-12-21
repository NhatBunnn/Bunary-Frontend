import styles from "./FriendCard.module.css";
import classNames from "classnames/bind";
import Button from "@components/Button/Button";
import { Image, Images } from "@assets/images";
import useFriendCard from "./useFriendCard";
import { MessageCircle, Users } from "lucide-react";

const c = classNames.bind(styles);

function FriendCard({ user, openChatWindow, className }) {
  const { sendFriendRequest, isRequestFriend, loading } = useFriendCard();

  return (
    <div className={c("friendCard", className)}>
      <div className={c("imageContainer")}>
        <Image src={user?.avatar || Images.avatar} />
      </div>
      
      <div className={c("info")}>
        <div className={c("name")} title={user?.fullName}>{user?.fullName || "User"}</div>
        
        <div className={c("actions")}>
          <Button
            onClick={(e) => {
              e.stopPropagation(); 
              sendFriendRequest(user.id);
            }}
            loading={loading}
            label={isRequestFriend ? "Đã gửi lời mời" : "Kết bạn"}
            size="sm"
            className="w-100" 
            startIcon={<Users fill="currentColor" size={16} />}
          />
          <Button
            label="Nhắn tin"
            size="sm"
            variant="outline" 
            className="w-100 border-0 bg-gray-50 hover-bg-gray-100"
            startIcon={<MessageCircle fill="currentColor" size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              openChatWindow(user);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default FriendCard;
