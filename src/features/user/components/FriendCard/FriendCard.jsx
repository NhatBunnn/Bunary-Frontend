import styles from "./FriendCard.module.css";
import classNames from "classnames/bind";
import Button from "@components/Button/Button";
import { faMessage, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { Image, Images } from "@assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFriendCard from "./useFriendCard";

const c = classNames.bind(styles);

function FriendCard({ user, openChatWindow, className }) {
  const { toggleFollow, loading } = useFriendCard();

  return (
    <div className={c("friendCard", className)}>
      <Image src={user?.avatar || Images.avatar} size="180px" />
      <div className={c("m-2")}>
        <div className={c("name", "mb-2")}>{user?.fullName}</div>
        <Button
          onClick={() => toggleFollow(user.id)}
          loading={loading}
          label="Theo dõi"
          startIcon={<FontAwesomeIcon icon={faUserFriends} />}
        />
        <Button
          label="Nhắn tin"
          startIcon={<FontAwesomeIcon icon={faMessage} />}
          onClick={() => {
            openChatWindow(user);
          }}
        />
      </div>
    </div>
  );
}

export default FriendCard;
