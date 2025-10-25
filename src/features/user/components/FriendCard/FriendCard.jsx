import styles from "./FriendCard.module.css";
import classNames from "classnames/bind";
import Button from "@components/Button/Button";
import { faMessage, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { Image, Images } from "@assets/images";

const c = classNames.bind(styles);

function FriendCard({ user, setReceiver, handelToggleChatWindow, className }) {
  return (
    <div className={c("friendCard", className)}>
      <Image src={user?.avatar || Images.avatar} size="180px" />
      <div className={c("m-2")}>
        <div className={c("name", "mb-2")}>{user?.fullName}</div>
        <Button label="Thêm bạn" icon={faUserFriends} />
        <Button
          label="Nhắn tin"
          icon={faMessage}
          onClick={() => {
            setReceiver({
              fullName: user?.fullName,
              avatar: user?.avatar,
              id: user?.id,
            });
            handelToggleChatWindow(true);
          }}
        />
      </div>
    </div>
  );
}

export default FriendCard;
