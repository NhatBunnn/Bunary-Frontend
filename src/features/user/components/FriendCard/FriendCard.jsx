import styles from "./FriendCard.module.css";
import classNames from "classnames/bind";
import Button from "@components/Button/Button";
import { faMessage, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { Image, Images } from "@assets/images";

const c = classNames.bind(styles);

function FriendCard({ user, openChatWindow, className }) {
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
            openChatWindow(user);
          }}
        />
      </div>
    </div>
  );
}

export default FriendCard;
